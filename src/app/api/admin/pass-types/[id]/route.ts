import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { passTypes } from "@/lib/db/schema";
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
  const { name, occasions, price_huf, valid_days, description, is_active, sort_order } =
    body;

  const [updated] = await db
    .update(passTypes)
    .set({
      name,
      occasions,
      priceHuf: price_huf,
      validDays: valid_days,
      description: description ?? null,
      isActive: is_active,
      sortOrder: sort_order,
    })
    .where(eq(passTypes.id, id))
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

  await db.delete(passTypes).where(eq(passTypes.id, id));

  return NextResponse.json({ success: true });
}
