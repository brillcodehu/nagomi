import { db } from "@/lib/db";
import { bookings, scheduledClasses, classTypes, instructors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Foglalas azonosito szukseges" },
        { status: 400 }
      );
    }

    const [row] = await db
      .select({
        id: bookings.id,
        classDate: bookings.classDate,
        customerName: bookings.customerName,
        customerEmail: bookings.customerEmail,
        customerPhone: bookings.customerPhone,
        status: bookings.status,
        paymentType: bookings.paymentType,
        amountHuf: bookings.amountHuf,
        cancelledAt: bookings.cancelledAt,
        cancellationReason: bookings.cancellationReason,
        createdAt: bookings.createdAt,
        startTime: scheduledClasses.startTime,
        ctName: classTypes.name,
        ctSlug: classTypes.slug,
        ctTagline: classTypes.tagline,
        ctDurationMin: classTypes.durationMin,
        ctPriceHuf: classTypes.priceHuf,
        ctDifficulty: classTypes.difficulty,
        ctIsPrivate: classTypes.isPrivate,
        instName: instructors.name,
        instAvatar: instructors.avatarUrl,
      })
      .from(bookings)
      .innerJoin(
        scheduledClasses,
        eq(bookings.scheduledClassId, scheduledClasses.id)
      )
      .innerJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
      .innerJoin(instructors, eq(scheduledClasses.instructorId, instructors.id))
      .where(eq(bookings.id, id))
      .limit(1);

    if (!row) {
      return Response.json(
        { error: "A foglalas nem talalhato" },
        { status: 404 }
      );
    }

    return Response.json({
      booking: {
        id: row.id,
        classDate: row.classDate,
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        status: row.status,
        paymentType: row.paymentType,
        amountHuf: row.amountHuf,
        cancelledAt: row.cancelledAt,
        cancellationReason: row.cancellationReason,
        createdAt: row.createdAt,
        className: row.ctName,
        classSlug: row.ctSlug,
        classTagline: row.ctTagline,
        startTime: row.startTime.slice(0, 5),
        durationMin: row.ctDurationMin,
        priceHuf: row.ctPriceHuf,
        difficulty: row.ctDifficulty,
        isPrivate: row.ctIsPrivate,
        instructorName: row.instName,
        instructorAvatar: row.instAvatar,
      },
    });
  } catch (error) {
    console.error("Booking detail API error:", error);
    return Response.json({ error: "Szerverhiba tortent" }, { status: 500 });
  }
}
