import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { classTypes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select()
    .from(classTypes)
    .orderBy(asc(classTypes.sortOrder));

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  if (!name || price_huf === undefined) {
    return NextResponse.json(
      { error: "A nev es az ar kitoltese kotelezo." },
      { status: 400 }
    );
  }

  const [inserted] = await db
    .insert(classTypes)
    .values({
      name,
      slug,
      description: description ?? null,
      tagline: tagline ?? null,
      durationMin: duration_min ?? 55,
      maxCapacity: max_capacity ?? 6,
      priceHuf: price_huf,
      difficulty: difficulty ?? 1,
      isPrivate: is_private ?? false,
      sortOrder: sort_order ?? 0,
    })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
