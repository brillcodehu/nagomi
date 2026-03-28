import { createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const cancelSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

/**
 * POST /api/bookings/cancel
 *
 * Cancel a booking. Handles Stripe refunds and pass occasion restoration.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cancelSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Ervenytelen adatok", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { bookingId, reason } = parsed.data;
    const supabase = await createAdminClient();

    // Fetch the booking
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single() as { data: { id: string; status: string; payment_type: string; stripe_payment_intent_id: string | null; pass_id: string | null; [key: string]: unknown } | null; error: { message: string } | null };

    if (fetchError || !booking) {
      return Response.json(
        { error: "A foglalas nem talalhato" },
        { status: 404 }
      );
    }

    // Only pending or confirmed bookings can be cancelled
    if (booking.status !== "pending" && booking.status !== "confirmed") {
      return Response.json(
        {
          error: "Ez a foglalas nem mondható le",
          message: `A foglalas jelenlegi allapota: ${booking.status}`,
        },
        { status: 400 }
      );
    }

    // Handle Stripe refund if it was a Stripe payment with a completed checkout
    if (
      booking.payment_type === "stripe" &&
      booking.stripe_payment_intent_id &&
      booking.status === "confirmed"
    ) {
      try {
        await stripe.refunds.create({
          payment_intent: booking.stripe_payment_intent_id,
        });
      } catch (refundError) {
        console.error("Stripe refund error:", refundError);
        return Response.json(
          {
            error: "Nem sikerult a visszaterites",
            message: "Kerlek vedd fel a kapcsolatot a studioval",
          },
          { status: 500 }
        );
      }
    }

    // If it was a pass payment, restore the occasion
    if (booking.payment_type === "pass" && booking.pass_id) {
      const { data: pass, error: passError } = await supabase
        .from("customer_passes")
        .select("id, remaining_occasions")
        .eq("id", booking.pass_id)
        .single() as { data: { id: string; remaining_occasions: number } | null; error: { message: string } | null };

      if (!passError && pass) {
        await supabase
          .from("customer_passes")
          .update({
            remaining_occasions: pass.remaining_occasions + 1,
          } as never)
          .eq("id", pass.id);
      }
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason ?? null,
      } as never)
      .eq("id", bookingId) as { error: { message: string } | null };

    if (updateError) {
      console.error("Booking cancel update error:", updateError);
      return Response.json(
        { error: "Nem sikerult lemondani a foglalast" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Booking cancel API error:", error);
    return Response.json(
      { error: "Szerverhiba tortent" },
      { status: 500 }
    );
  }
}
