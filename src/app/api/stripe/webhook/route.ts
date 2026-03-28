import { createAdminClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/stripe/helpers";
import { stripe } from "@/lib/stripe/client";
import { resend, EMAIL_FROM, ADMIN_EMAIL } from "@/lib/email/resend";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events:
 * - checkout.session.completed: confirms bookings or creates passes
 * - checkout.session.expired: cancels pending bookings
 */
export async function POST(request: Request) {
  let event: Stripe.Event;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Hianyzik a stripe-signature header", {
        status: 400,
      });
    }

    event = await verifyWebhookSignature(body, signature);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Webhook alairas ellenorzes sikertelen", {
      status: 400,
    });
  }

  try {
    const supabase = await createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};

        if (metadata.type === "class_booking") {
          await handleClassBookingCompleted(supabase, session, metadata);
        } else if (metadata.type === "pass_purchase") {
          await handlePassPurchaseCompleted(supabase, session, metadata);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};

        if (metadata.type === "class_booking" && metadata.booking_id) {
          // Cancel the pending booking to free up the spot
          await supabase
            .from("bookings")
            .update({
              status: "cancelled",
              cancelled_at: new Date().toISOString(),
              cancellation_reason: "Fizetes lejart (Stripe session expired)",
            } as never)
            .eq("id", metadata.booking_id)
            .eq("status", "pending");
        }
        break;
      }

      default:
        // Unhandled event type, just acknowledge
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Webhook feldolgozasi hiba", { status: 500 });
  }
}

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

async function handleClassBookingCompleted(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const bookingId = metadata.booking_id;
  if (!bookingId) return;

  // Retrieve payment intent ID from the session
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Update booking to confirmed
  const { data: booking, error } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      stripe_payment_intent_id: paymentIntentId,
    } as never)
    .eq("id", bookingId)
    .select(
      `
      id,
      customer_name,
      customer_email,
      class_date,
      amount_huf,
      scheduled_classes (
        start_time,
        class_types (
          name,
          duration_min
        ),
        instructors (
          name
        )
      )
    `
    )
    .single() as { data: { id: string; customer_name: string; customer_email: string; class_date: string; amount_huf: number | null; scheduled_classes: { start_time: string; class_types: { name: string; duration_min: number }; instructors: { name: string } } | null } | null; error: { message: string } | null };

  if (error || !booking) {
    console.error("Failed to confirm booking:", error);
    return;
  }

  const sc = booking.scheduled_classes as unknown as {
    start_time: string;
    class_types: { name: string; duration_min: number };
    instructors: { name: string };
  };

  // Send confirmation email to customer
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: booking.customer_email,
      subject: `Foglalas megerositese - ${sc.class_types.name}`,
      html: `
        <h2>Kedves ${booking.customer_name}!</h2>
        <p>A foglalasod sikeresen megerositesre kerult.</p>
        <table style="border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Ora:</td><td>${sc.class_types.name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Datum:</td><td>${booking.class_date}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Idopont:</td><td>${sc.start_time.slice(0, 5)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Idotartam:</td><td>${sc.class_types.duration_min} perc</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Oktato:</td><td>${sc.instructors.name}</td></tr>
        </table>
        <p>Varunk szeretettel a Nagomi Pilates Studioban!</p>
      `,
    });
  } catch (emailError) {
    console.error("Customer confirmation email error:", emailError);
  }

  // Send admin notification
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `Uj foglalas - ${booking.customer_name} - ${sc.class_types.name}`,
      html: `
        <h3>Uj foglalas erkezett</h3>
        <p><strong>Vendeg:</strong> ${booking.customer_name} (${booking.customer_email})</p>
        <p><strong>Ora:</strong> ${sc.class_types.name}</p>
        <p><strong>Datum:</strong> ${booking.class_date} ${sc.start_time.slice(0, 5)}</p>
        <p><strong>Oktato:</strong> ${sc.instructors.name}</p>
        <p><strong>Osszeg:</strong> ${booking.amount_huf?.toLocaleString("hu-HU")} Ft</p>
      `,
    });
  } catch (emailError) {
    console.error("Admin notification email error:", emailError);
  }
}

async function handlePassPurchaseCompleted(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const passTypeId = metadata.pass_type_id;
  const customerName = metadata.customer_name;
  const customerEmail = metadata.customer_email;
  const customerPhone = metadata.customer_phone;

  if (!passTypeId || !customerEmail) return;

  // Fetch pass type details
  const { data: passType, error: ptError } = await supabase
    .from("pass_types")
    .select("*")
    .eq("id", passTypeId)
    .single() as { data: { id: string; name: string; occasions: number; price_huf: number; valid_days: number; description: string | null; is_active: boolean; sort_order: number } | null; error: { message: string } | null };

  if (ptError || !passType) {
    console.error("Pass type not found in webhook:", ptError);
    return;
  }

  // Calculate expiry date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + passType.valid_days);

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Create customer_passes record
  const { error: insertError } = await supabase
    .from("customer_passes")
    .insert({
      pass_type_id: passTypeId,
      customer_email: customerEmail,
      customer_name: customerName ?? "",
      customer_phone: customerPhone ?? null,
      remaining_occasions: passType.occasions,
      expires_at: expiresAt.toISOString(),
      stripe_payment_intent_id: paymentIntentId,
      stripe_checkout_session_id: session.id,
      is_active: true,
    } as never);

  if (insertError) {
    console.error("Failed to create customer pass:", insertError);
    return;
  }

  // Send pass confirmation email
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: customerEmail,
      subject: `Berlet vasarlas megerositese - ${passType.name}`,
      html: `
        <h2>Kedves ${customerName}!</h2>
        <p>A berleted sikeresen aktiválva lett.</p>
        <table style="border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Berlet:</td><td>${passType.name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Alkalmak:</td><td>${passType.occasions} alkalom</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Ervenyes:</td><td>${expiresAt.toLocaleDateString("hu-HU")}-ig</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Ar:</td><td>${passType.price_huf.toLocaleString("hu-HU")} Ft</td></tr>
        </table>
        <p>Foglalj orakat a berleteddel a weboldalunkon!</p>
      `,
    });
  } catch (emailError) {
    console.error("Pass confirmation email error:", emailError);
  }

  // Admin notification
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `Uj berlet vasarlas - ${customerName} - ${passType.name}`,
      html: `
        <h3>Uj berlet vasarlas</h3>
        <p><strong>Vendeg:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Berlet:</strong> ${passType.name} (${passType.occasions} alkalom)</p>
        <p><strong>Ervenyes:</strong> ${expiresAt.toLocaleDateString("hu-HU")}-ig</p>
        <p><strong>Osszeg:</strong> ${passType.price_huf.toLocaleString("hu-HU")} Ft</p>
      `,
    });
  } catch (emailError) {
    console.error("Admin pass notification email error:", emailError);
  }
}
