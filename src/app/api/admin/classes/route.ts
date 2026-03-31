import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { scheduledClasses, classTypes, instructors } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: scheduledClasses.id,
      class_type_id: scheduledClasses.classTypeId,
      instructor_id: scheduledClasses.instructorId,
      day_of_week: scheduledClasses.dayOfWeek,
      start_time: scheduledClasses.startTime,
      max_spots_override: scheduledClasses.maxSpotsOverride,
      is_cancelled: scheduledClasses.isCancelled,
      notes: scheduledClasses.notes,
      specific_date: scheduledClasses.specificDate,
      created_at: scheduledClasses.createdAt,
      ct_name: classTypes.name,
      ct_max_capacity: classTypes.maxCapacity,
      inst_name: instructors.name,
    })
    .from(scheduledClasses)
    .leftJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
    .leftJoin(instructors, eq(scheduledClasses.instructorId, instructors.id))
    .where(eq(scheduledClasses.isCancelled, false))
    .orderBy(
      asc(scheduledClasses.dayOfWeek),
      asc(scheduledClasses.startTime)
    );

  // Transform to match expected frontend format
  const data = rows.map((r) => ({
    id: r.id,
    class_type_id: r.class_type_id,
    instructor_id: r.instructor_id,
    day_of_week: r.day_of_week,
    start_time: r.start_time,
    max_spots_override: r.max_spots_override,
    is_cancelled: r.is_cancelled,
    notes: r.notes,
    specific_date: r.specific_date,
    created_at: r.created_at,
    class_types: r.ct_name
      ? { name: r.ct_name, max_capacity: r.ct_max_capacity }
      : null,
    instructors: r.inst_name ? { name: r.inst_name } : null,
  }));

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { class_type_id, instructor_id, day_of_week, start_time, max_spots_override } =
    body;

  if (!class_type_id || !instructor_id || !start_time) {
    return NextResponse.json(
      { error: "Hianyzo kotelezo mezok." },
      { status: 400 }
    );
  }

  const [inserted] = await db
    .insert(scheduledClasses)
    .values({
      classTypeId: class_type_id,
      instructorId: instructor_id,
      dayOfWeek: day_of_week ?? null,
      startTime: start_time,
      maxSpotsOverride: max_spots_override ?? null,
    })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
