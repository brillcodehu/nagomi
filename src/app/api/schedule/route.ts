import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { scheduledClasses, classTypes, instructors, bookings } from "@/lib/db/schema";
import { eq, and, inArray, gte, lte, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const weekStart = searchParams.get("weekStart");
    const classTypeSlug = searchParams.get("classType");
    const instructorId = searchParams.get("instructor");

    if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return Response.json(
        { error: "weekStart parameter szukseges (YYYY-MM-DD formatum)" },
        { status: 400 }
      );
    }

    const weekStartDate = new Date(weekStart + "T00:00:00");
    if (isNaN(weekStartDate.getTime())) {
      return Response.json({ error: "Ervenytelen datum" }, { status: 400 });
    }

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekEnd = weekEndDate.toISOString().split("T")[0];

    const daysInWeek: Array<{ date: string; dayOfWeek: number }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStartDate);
      d.setDate(d.getDate() + i);
      const isoString = d.toISOString().split("T")[0];
      const jsDay = d.getDay();
      const isoDay = jsDay === 0 ? 7 : jsDay;
      daysInWeek.push({ date: isoString, dayOfWeek: isoDay });
    }

    // Build conditions
    const conditions = [eq(scheduledClasses.isCancelled, false)];
    if (instructorId) {
      conditions.push(eq(scheduledClasses.instructorId, instructorId));
    }
    if (classTypeSlug) {
      conditions.push(eq(classTypes.slug, classTypeSlug));
    }

    const rows = await db
      .select({
        id: scheduledClasses.id,
        dayOfWeek: scheduledClasses.dayOfWeek,
        startTime: scheduledClasses.startTime,
        specificDate: scheduledClasses.specificDate,
        maxSpotsOverride: scheduledClasses.maxSpotsOverride,
        ctName: classTypes.name,
        ctSlug: classTypes.slug,
        ctTagline: classTypes.tagline,
        ctDurationMin: classTypes.durationMin,
        ctMaxCapacity: classTypes.maxCapacity,
        ctPriceHuf: classTypes.priceHuf,
        ctDifficulty: classTypes.difficulty,
        ctIsPrivate: classTypes.isPrivate,
        instName: instructors.name,
        instAvatar: instructors.avatarUrl,
      })
      .from(scheduledClasses)
      .innerJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
      .innerJoin(instructors, eq(scheduledClasses.instructorId, instructors.id))
      .where(and(...conditions));

    if (rows.length === 0) {
      return Response.json({ schedule: [] });
    }

    type SlotData = {
      scheduledClassId: string;
      classDate: string;
      startTime: string;
      maxSpots: number;
      ctName: string;
      ctSlug: string;
      ctTagline: string | null;
      ctDurationMin: number;
      ctPriceHuf: number;
      ctDifficulty: number | null;
      ctIsPrivate: boolean | null;
      instName: string;
      instAvatar: string | null;
    };

    const slots: SlotData[] = [];

    for (const sc of rows) {
      const maxSpots = sc.maxSpotsOverride ?? sc.ctMaxCapacity;

      if (sc.specificDate) {
        if (sc.specificDate >= weekStart && sc.specificDate <= weekEnd) {
          slots.push({
            scheduledClassId: sc.id,
            classDate: sc.specificDate,
            startTime: sc.startTime.slice(0, 5),
            maxSpots,
            ctName: sc.ctName,
            ctSlug: sc.ctSlug,
            ctTagline: sc.ctTagline,
            ctDurationMin: sc.ctDurationMin,
            ctPriceHuf: sc.ctPriceHuf,
            ctDifficulty: sc.ctDifficulty,
            ctIsPrivate: sc.ctIsPrivate,
            instName: sc.instName,
            instAvatar: sc.instAvatar,
          });
        }
      } else if (sc.dayOfWeek !== null) {
        for (const day of daysInWeek) {
          if (day.dayOfWeek === sc.dayOfWeek) {
            slots.push({
              scheduledClassId: sc.id,
              classDate: day.date,
              startTime: sc.startTime.slice(0, 5),
              maxSpots,
              ctName: sc.ctName,
              ctSlug: sc.ctSlug,
              ctTagline: sc.ctTagline,
              ctDurationMin: sc.ctDurationMin,
              ctPriceHuf: sc.ctPriceHuf,
              ctDifficulty: sc.ctDifficulty,
              ctIsPrivate: sc.ctIsPrivate,
              instName: sc.instName,
              instAvatar: sc.instAvatar,
            });
          }
        }
      }
    }

    if (slots.length === 0) {
      return Response.json({ schedule: [] });
    }

    // Booking counts
    const bookingRows = await db
      .select({
        scheduledClassId: bookings.scheduledClassId,
        classDate: bookings.classDate,
        count: sql<number>`count(*)::int`,
      })
      .from(bookings)
      .where(
        and(
          inArray(bookings.status, ["pending", "confirmed"]),
          gte(bookings.classDate, weekStart),
          lte(bookings.classDate, weekEnd)
        )
      )
      .groupBy(bookings.scheduledClassId, bookings.classDate);

    const countMap = new Map<string, number>();
    for (const b of bookingRows) {
      countMap.set(`${b.scheduledClassId}:${b.classDate}`, b.count);
    }

    const schedule = slots
      .map((slot) => {
        const bookedSpots =
          countMap.get(`${slot.scheduledClassId}:${slot.classDate}`) ?? 0;
        return {
          id: slot.scheduledClassId,
          classDate: slot.classDate,
          className: slot.ctName,
          classSlug: slot.ctSlug,
          classTagline: slot.ctTagline,
          startTime: slot.startTime,
          durationMin: slot.ctDurationMin,
          priceHuf: slot.ctPriceHuf,
          difficulty: slot.ctDifficulty,
          isPrivate: slot.ctIsPrivate,
          instructorName: slot.instName,
          instructorAvatar: slot.instAvatar,
          maxSpots: slot.maxSpots,
          bookedSpots,
          availableSpots: Math.max(0, slot.maxSpots - bookedSpots),
        };
      })
      .sort((a, b) => {
        const dateCompare = a.classDate.localeCompare(b.classDate);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

    return Response.json({ schedule });
  } catch (error) {
    console.error("Schedule API error:", error);
    return Response.json({ error: "Szerverhiba tortent" }, { status: 500 });
  }
}
