import { db } from "@/lib/db";
import {
  scheduledClasses,
  classTypes,
  instructors,
  bookings,
  customerPasses,
} from "@/lib/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
import { createClassCheckoutSession } from "@/lib/stripe/helpers";
import { bookingFormSchema } from "@/lib/utils/validators";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Ervenytelen adatok", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      scheduledClassId,
      classDate,
      customerName,
      customerEmail,
      customerPhone,
      paymentType,
      passId,
    } = parsed.data;

    // Fetch class details
    const [scRow] = await db
      .select({
        id: scheduledClasses.id,
        startTime: scheduledClasses.startTime,
        maxSpotsOverride: scheduledClasses.maxSpotsOverride,
        isCancelled: scheduledClasses.isCancelled,
        ctName: classTypes.name,
        ctSlug: classTypes.slug,
        ctPriceHuf: classTypes.priceHuf,
        ctMaxCapacity: classTypes.maxCapacity,
        instName: instructors.name,
      })
      .from(scheduledClasses)
      .innerJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
      .innerJoin(instructors, eq(scheduledClasses.instructorId, instructors.id))
      .where(eq(scheduledClasses.id, scheduledClassId))
      .limit(1);

    if (!scRow) {
      return Response.json({ error: "Az ora nem talalhato" }, { status: 404 });
    }

    if (scRow.isCancelled) {
      return Response.json(
        { error: "Ez az ora torolve lett" },
        { status: 400 }
      );
    }

    const maxSpots = scRow.maxSpotsOverride ?? scRow.ctMaxCapacity;

    // Check available spots
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(bookings)
      .where(
        and(
          eq(bookings.scheduledClassId, scheduledClassId),
          eq(bookings.classDate, classDate),
          inArray(bookings.status, ["pending", "confirmed"])
        )
      );

    if ((countResult?.count ?? 0) >= maxSpots) {
      return Response.json(
        { error: "CLASS_FULL", message: "Nincs tobb szabad hely" },
        { status: 409 }
      );
    }

    // ----- STRIPE PAYMENT -----
    if (paymentType === "stripe") {
      let bookingId: string;
      try {
        const [inserted] = await db
          .insert(bookings)
          .values({
            scheduledClassId,
            classDate,
            customerName,
            customerEmail,
            customerPhone,
            status: "pending",
            paymentType: "stripe",
            amountHuf: scRow.ctPriceHuf,
          })
          .returning({ id: bookings.id });
        bookingId = inserted.id;
      } catch (err: unknown) {
        const pgErr = err as { code?: string; message?: string };
        if (pgErr.code === "23505") {
          return Response.json(
            {
              error: "DUPLICATE_BOOKING",
              message: "Mar van foglalasod erre az orara",
            },
            { status: 409 }
          );
        }
        console.error("Booking insert error:", err);
        return Response.json(
          { error: "Nem sikerult letrehozni a foglalast" },
          { status: 500 }
        );
      }

      const headersList = await headers();
      const origin =
        headersList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

      const session = await createClassCheckoutSession({
        bookingId,
        className: scRow.ctName,
        classDate,
        startTime: scRow.startTime.slice(0, 5),
        instructorName: scRow.instName,
        priceHuf: scRow.ctPriceHuf,
        customerEmail,
        origin,
      });

      await db
        .update(bookings)
        .set({ stripeCheckoutSessionId: session.id })
        .where(eq(bookings.id, bookingId));

      return Response.json({ checkoutUrl: session.url });
    }

    // ----- PASS PAYMENT -----
    if (paymentType === "pass") {
      if (!passId) {
        return Response.json(
          { error: "PASS_INVALID", message: "Berlet azonosito szukseges" },
          { status: 400 }
        );
      }

      const [pass] = await db
        .select()
        .from(customerPasses)
        .where(eq(customerPasses.id, passId))
        .limit(1);

      if (!pass) {
        return Response.json(
          { error: "PASS_INVALID", message: "A berlet nem talalhato" },
          { status: 404 }
        );
      }

      if (!pass.isActive) {
        return Response.json(
          { error: "PASS_INVALID", message: "A berlet inaktiv" },
          { status: 400 }
        );
      }

      if (pass.remainingOccasions <= 0) {
        return Response.json(
          {
            error: "PASS_INVALID",
            message: "A berleten nem maradt felhasznalhato alkalom",
          },
          { status: 400 }
        );
      }

      if (pass.expiresAt < new Date()) {
        return Response.json(
          { error: "PASS_INVALID", message: "A berlet lejart" },
          { status: 400 }
        );
      }

      if (pass.customerEmail !== customerEmail) {
        return Response.json(
          {
            error: "PASS_INVALID",
            message: "A berlet nem ehhez az email cimhez tartozik",
          },
          { status: 400 }
        );
      }

      let bookingId: string;
      try {
        const [inserted] = await db
          .insert(bookings)
          .values({
            scheduledClassId,
            classDate,
            customerName,
            customerEmail,
            customerPhone,
            status: "confirmed",
            paymentType: "pass",
            passId,
          })
          .returning({ id: bookings.id });
        bookingId = inserted.id;
      } catch (err: unknown) {
        const pgErr = err as { code?: string; message?: string };
        if (pgErr.code === "23505") {
          return Response.json(
            {
              error: "DUPLICATE_BOOKING",
              message: "Mar van foglalasod erre az orara",
            },
            { status: 409 }
          );
        }
        console.error("Booking insert error (pass):", err);
        return Response.json(
          { error: "Nem sikerult letrehozni a foglalast" },
          { status: 500 }
        );
      }

      // Decrement pass occasions
      await db
        .update(customerPasses)
        .set({ remainingOccasions: sql`${customerPasses.remainingOccasions} - 1` })
        .where(eq(customerPasses.id, passId));

      return Response.json({ success: true, bookingId });
    }

    return Response.json(
      { error: "Ismeretlen fizetesi mod" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Bookings API error:", error);
    return Response.json({ error: "Szerverhiba tortent" }, { status: 500 });
  }
}
