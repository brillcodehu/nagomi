import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { customerPasses, passTypes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: customerPasses.id,
      customer_name: customerPasses.customerName,
      customer_email: customerPasses.customerEmail,
      customer_phone: customerPasses.customerPhone,
      remaining_occasions: customerPasses.remainingOccasions,
      purchased_at: customerPasses.purchasedAt,
      expires_at: customerPasses.expiresAt,
      is_active: customerPasses.isActive,
      pt_name: passTypes.name,
      pt_occasions: passTypes.occasions,
    })
    .from(customerPasses)
    .leftJoin(passTypes, eq(customerPasses.passTypeId, passTypes.id))
    .orderBy(desc(customerPasses.purchasedAt));

  const data = rows.map((r) => ({
    id: r.id,
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    customer_phone: r.customer_phone,
    remaining_occasions: r.remaining_occasions,
    purchased_at: r.purchased_at,
    expires_at: r.expires_at,
    is_active: r.is_active,
    pass_types: r.pt_name
      ? { name: r.pt_name, occasions: r.pt_occasions }
      : null,
  }));

  return NextResponse.json(data);
}
