import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { passTypes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select()
    .from(passTypes)
    .orderBy(asc(passTypes.sortOrder));

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, occasions, price_huf, valid_days, description, is_active, sort_order } =
    body;

  if (!name || !occasions || price_huf === undefined) {
    return NextResponse.json(
      { error: "A nev, alkalmak szama es ar kitoltese kotelezo." },
      { status: 400 }
    );
  }

  const [inserted] = await db
    .insert(passTypes)
    .values({
      name,
      occasions,
      priceHuf: price_huf,
      validDays: valid_days ?? 30,
      description: description ?? null,
      isActive: is_active ?? true,
      sortOrder: sort_order ?? 0,
    })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
