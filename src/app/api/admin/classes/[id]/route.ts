import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { scheduledClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { class_type_id, instructor_id, day_of_week, start_time, max_spots_override } =
    body;

  const [updated] = await db
    .update(scheduledClasses)
    .set({
      classTypeId: class_type_id,
      instructorId: instructor_id,
      dayOfWeek: day_of_week ?? null,
      startTime: start_time,
      maxSpotsOverride: max_spots_override ?? null,
    })
    .where(eq(scheduledClasses.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Nem talalhato" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Soft delete
  await db
    .update(scheduledClasses)
    .set({ isCancelled: true })
    .where(eq(scheduledClasses.id, id));

  return NextResponse.json({ success: true });
}
