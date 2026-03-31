import { db } from "@/lib/db";
import {
  bookings,
  scheduledClasses,
  classTypes,
  instructors,
  passTypes,
  customerPasses,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyWebhookSignature } from "@/lib/stripe/helpers";
import { resend, EMAIL_FROM, ADMIN_EMAIL } from "@/lib/email/resend";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

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
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};

        if (metadata.type === "class_booking") {
          await handleClassBookingCompleted(session, metadata);
        } else if (metadata.type === "pass_purchase") {
          await handlePassPurchaseCompleted(session, metadata);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};

        if (metadata.type === "class_booking" && metadata.booking_id) {
          await db
            .update(bookings)
            .set({
              status: "cancelled",
              cancelledAt: new Date(),
              cancellationReason:
                "Fizetes lejart (Stripe session expired)",
            })
            .where(eq(bookings.id, metadata.booking_id));
        }
        break;
      }

      default:
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Webhook feldolgozasi hiba", { status: 500 });
  }
}

async function handleClassBookingCompleted(
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const bookingId = metadata.booking_id;
  if (!bookingId) return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Update and return booking with class info
  await db
    .update(bookings)
    .set({
      status: "confirmed",
      stripePaymentIntentId: paymentIntentId,
    })
    .where(eq(bookings.id, bookingId));

  const [booking] = await db
    .select({
      id: bookings.id,
      customerName: bookings.customerName,
      customerEmail: bookings.customerEmail,
      classDate: bookings.classDate,
      amountHuf: bookings.amountHuf,
      startTime: scheduledClasses.startTime,
      ctName: classTypes.name,
      ctDurationMin: classTypes.durationMin,
      instName: instructors.name,
    })
    .from(bookings)
    .innerJoin(
      scheduledClasses,
      eq(bookings.scheduledClassId, scheduledClasses.id)
    )
    .innerJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
    .innerJoin(instructors, eq(scheduledClasses.instructorId, instructors.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    console.error("Failed to find booking after confirm:", bookingId);
    return;
  }

  // Send confirmation email to customer
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: booking.customerEmail,
      subject: `Foglalas megerositese - ${booking.ctName}`,
      html: `
        <h2>Kedves ${booking.customerName}!</h2>
        <p>A foglalasod sikeresen megerositesre kerult.</p>
        <table style="border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Ora:</td><td>${booking.ctName}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Datum:</td><td>${booking.classDate}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Idopont:</td><td>${booking.startTime.slice(0, 5)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Idotartam:</td><td>${booking.ctDurationMin} perc</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Oktato:</td><td>${booking.instName}</td></tr>
        </table>
        <p>Varunk szeretettel a Nagomi Pilates Studioban!</p>
      `,
    });
  } catch (emailError) {
    console.error("Customer confirmation email error:", emailError);
  }

  // Admin notification
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `Uj foglalas - ${booking.customerName} - ${booking.ctName}`,
      html: `
        <h3>Uj foglalas erkezett</h3>
        <p><strong>Vendeg:</strong> ${booking.customerName} (${booking.customerEmail})</p>
        <p><strong>Ora:</strong> ${booking.ctName}</p>
        <p><strong>Datum:</strong> ${booking.classDate} ${booking.startTime.slice(0, 5)}</p>
        <p><strong>Oktato:</strong> ${booking.instName}</p>
        <p><strong>Osszeg:</strong> ${booking.amountHuf?.toLocaleString("hu-HU")} Ft</p>
      `,
    });
  } catch (emailError) {
    console.error("Admin notification email error:", emailError);
  }
}

async function handlePassPurchaseCompleted(
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const passTypeId = metadata.pass_type_id;
  const customerName = metadata.customer_name;
  const customerEmail = metadata.customer_email;
  const customerPhone = metadata.customer_phone;

  if (!passTypeId || !customerEmail) return;

  const [passType] = await db
    .select()
    .from(passTypes)
    .where(eq(passTypes.id, passTypeId))
    .limit(1);

  if (!passType) {
    console.error("Pass type not found in webhook:", passTypeId);
    return;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (passType.validDays ?? 30));

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const [insertResult] = await db
    .insert(customerPasses)
    .values({
      passTypeId,
      customerEmail,
      customerName: customerName ?? "",
      customerPhone: customerPhone ?? null,
      remainingOccasions: passType.occasions,
      expiresAt,
      stripePaymentIntentId: paymentIntentId,
      stripeCheckoutSessionId: session.id,
      isActive: true,
    })
    .returning({ id: customerPasses.id });

  if (!insertResult) {
    console.error("Failed to create customer pass");
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
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Ar:</td><td>${passType.priceHuf.toLocaleString("hu-HU")} Ft</td></tr>
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
        <p><strong>Osszeg:</strong> ${passType.priceHuf.toLocaleString("hu-HU")} Ft</p>
      `,
    });
  } catch (emailError) {
    console.error("Admin pass notification email error:", emailError);
  }
}
