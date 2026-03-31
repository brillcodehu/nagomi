import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { instructors } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select({
      id: instructors.id,
      name: instructors.name,
      email: instructors.email,
      bio: instructors.bio,
      avatar_url: instructors.avatarUrl,
      is_active: instructors.isActive,
      created_at: instructors.createdAt,
    })
    .from(instructors)
    .where(eq(instructors.isActive, true))
    .orderBy(asc(instructors.name));

  return NextResponse.json(data);
}
