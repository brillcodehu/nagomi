import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
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
  const { status } = body;

  const validStatuses = ["pending", "confirmed", "cancelled", "no_show"];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Ervenytelen statusz." },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = { status };

  if (status === "cancelled") {
    updateData.cancelledAt = new Date();
  }

  const [updated] = await db
    .update(bookings)
    .set(updateData)
    .where(eq(bookings.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Nem talalhato" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
