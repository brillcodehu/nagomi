import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { classTypes } from "@/lib/db/schema";
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
  const {
    name,
    slug,
    description,
    tagline,
    duration_min,
    max_capacity,
    price_huf,
    difficulty,
    is_private,
    sort_order,
  } = body;

  const [updated] = await db
    .update(classTypes)
    .set({
      name,
      slug,
      description: description ?? null,
      tagline: tagline ?? null,
      durationMin: duration_min,
      maxCapacity: max_capacity,
      priceHuf: price_huf,
      difficulty,
      isPrivate: is_private,
      sortOrder: sort_order,
    })
    .where(eq(classTypes.id, id))
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

  await db.delete(classTypes).where(eq(classTypes.id, id));

  return NextResponse.json({ success: true });
}
