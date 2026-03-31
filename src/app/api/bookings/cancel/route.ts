import { db } from "@/lib/db";
import { bookings, customerPasses } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { stripe } from "@/lib/stripe/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const cancelSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

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

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return Response.json(
        { error: "A foglalas nem talalhato" },
        { status: 404 }
      );
    }

    if (booking.status !== "pending" && booking.status !== "confirmed") {
      return Response.json(
        {
          error: "Ez a foglalas nem mondható le",
          message: `A foglalas jelenlegi allapota: ${booking.status}`,
        },
        { status: 400 }
      );
    }

    // Stripe refund
    if (
      booking.paymentType === "stripe" &&
      booking.stripePaymentIntentId &&
      booking.status === "confirmed"
    ) {
      try {
        await stripe.refunds.create({
          payment_intent: booking.stripePaymentIntentId,
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

    // Restore pass occasion
    if (booking.paymentType === "pass" && booking.passId) {
      await db
        .update(customerPasses)
        .set({
          remainingOccasions: sql`${customerPasses.remainingOccasions} + 1`,
        })
        .where(eq(customerPasses.id, booking.passId));
    }

    // Cancel booking
    await db
      .update(bookings)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: reason ?? null,
      })
      .where(eq(bookings.id, bookingId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Booking cancel API error:", error);
    return Response.json({ error: "Szerverhiba tortent" }, { status: 500 });
  }
}
