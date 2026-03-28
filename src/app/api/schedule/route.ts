import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/schedule?weekStart=2026-03-30&classType=reformer&instructor=uuid
 *
 * Returns the weekly schedule with booking counts for each class slot.
 */
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
      return Response.json(
        { error: "Ervenytelen datum" },
        { status: 400 }
      );
    }

    // Calculate week end (7 days)
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekEnd = weekEndDate.toISOString().split("T")[0];

    // Build days of week mapping: each date in the week and its ISO day (1=Monday..7=Sunday)
    const daysInWeek: Array<{ date: string; dayOfWeek: number }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStartDate);
      d.setDate(d.getDate() + i);
      const isoString = d.toISOString().split("T")[0];
      // getDay() returns 0=Sunday, convert to ISO 1=Monday..7=Sunday
      const jsDay = d.getDay();
      const isoDay = jsDay === 0 ? 7 : jsDay;
      daysInWeek.push({ date: isoString, dayOfWeek: isoDay });
    }

    const supabase = await createAdminClient();

    // Fetch all active scheduled classes with joins
    let query = supabase
      .from("scheduled_classes")
      .select(
        `
        id,
        day_of_week,
        start_time,
        specific_date,
        max_spots_override,
        is_cancelled,
        class_types!inner (
          id,
          name,
          slug,
          tagline,
          duration_min,
          max_capacity,
          price_huf,
          difficulty,
          is_private
        ),
        instructors!inner (
          id,
          name,
          avatar_url
        )
      `
      )
      .eq("is_cancelled", false);

    if (classTypeSlug) {
      query = query.eq("class_types.slug", classTypeSlug);
    }

    if (instructorId) {
      query = query.eq("instructor_id", instructorId);
    }

    const { data: scheduledClasses, error: classError } = await query as { data: { id: string; day_of_week: number | null; start_time: string; specific_date: string | null; max_spots_override: number | null; is_cancelled: boolean; class_types: { id: string; name: string; slug: string; tagline: string | null; duration_min: number; max_capacity: number; price_huf: number; difficulty: number; is_private: boolean }; instructors: { id: string; name: string; avatar_url: string | null } }[] | null; error: { message: string } | null };

    if (classError) {
      console.error("Schedule query error:", classError);
      return Response.json(
        { error: "Nem sikerult lekerni az orarendet" },
        { status: 500 }
      );
    }

    if (!scheduledClasses || scheduledClasses.length === 0) {
      return Response.json({ schedule: [] });
    }

    // Expand recurring and specific-date classes into concrete slots for the week
    type ScheduleSlot = {
      scheduledClassId: string;
      classDate: string;
      classType: {
        name: string;
        slug: string;
        tagline: string | null;
        duration_min: number;
        max_capacity: number;
        price_huf: number;
        difficulty: number;
        is_private: boolean;
      };
      instructor: {
        name: string;
        avatar_url: string | null;
      };
      startTime: string;
      maxSpots: number;
    };

    const slots: ScheduleSlot[] = [];

    for (const sc of scheduledClasses) {
      // Type narrowing for joined data
      const ct = sc.class_types as unknown as {
        id: string;
        name: string;
        slug: string;
        tagline: string | null;
        duration_min: number;
        max_capacity: number;
        price_huf: number;
        difficulty: number;
        is_private: boolean;
      };
      const inst = sc.instructors as unknown as {
        id: string;
        name: string;
        avatar_url: string | null;
      };

      const maxSpots = sc.max_spots_override ?? ct.max_capacity;

      if (sc.specific_date) {
        // Specific date class: only include if within the week
        if (sc.specific_date >= weekStart && sc.specific_date <= weekEnd) {
          slots.push({
            scheduledClassId: sc.id,
            classDate: sc.specific_date,
            classType: ct,
            instructor: inst,
            startTime: sc.start_time.slice(0, 5), // HH:MM
            maxSpots,
          });
        }
      } else if (sc.day_of_week !== null) {
        // Recurring class: find matching day(s) in the week
        for (const day of daysInWeek) {
          if (day.dayOfWeek === sc.day_of_week) {
            slots.push({
              scheduledClassId: sc.id,
              classDate: day.date,
              classType: ct,
              instructor: inst,
              startTime: sc.start_time.slice(0, 5),
              maxSpots,
            });
          }
        }
      }
    }

    if (slots.length === 0) {
      return Response.json({ schedule: [] });
    }

    // Fetch booking counts for all relevant (scheduledClassId, classDate) pairs
    const { data: bookings, error: bookingError } = await supabase
      .from("bookings")
      .select("scheduled_class_id, class_date")
      .in("status", ["pending", "confirmed"])
      .gte("class_date", weekStart)
      .lte("class_date", weekEnd) as { data: { scheduled_class_id: string; class_date: string }[] | null; error: { message: string } | null };

    if (bookingError) {
      console.error("Booking count query error:", bookingError);
      return Response.json(
        { error: "Nem sikerult lekerni a foglalasokat" },
        { status: 500 }
      );
    }

    // Build a count map: "scheduledClassId:classDate" -> count
    const countMap = new Map<string, number>();
    for (const b of bookings ?? []) {
      const key = `${b.scheduled_class_id}:${b.class_date}`;
      countMap.set(key, (countMap.get(key) ?? 0) + 1);
    }

    // Assemble response
    const schedule = slots
      .map((slot) => {
        const bookedSpots =
          countMap.get(`${slot.scheduledClassId}:${slot.classDate}`) ?? 0;
        return {
          id: slot.scheduledClassId,
          classDate: slot.classDate,
          className: slot.classType.name,
          classSlug: slot.classType.slug,
          classTagline: slot.classType.tagline,
          startTime: slot.startTime,
          durationMin: slot.classType.duration_min,
          priceHuf: slot.classType.price_huf,
          difficulty: slot.classType.difficulty,
          isPrivate: slot.classType.is_private,
          instructorName: slot.instructor.name,
          instructorAvatar: slot.instructor.avatar_url,
          maxSpots: slot.maxSpots,
          bookedSpots,
          availableSpots: Math.max(0, slot.maxSpots - bookedSpots),
        };
      })
      .sort((a, b) => {
        // Sort by date then by time
        const dateCompare = a.classDate.localeCompare(b.classDate);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

    return Response.json({ schedule });
  } catch (error) {
    console.error("Schedule API error:", error);
    return Response.json(
      { error: "Szerverhiba tortent" },
      { status: 500 }
    );
  }
}
