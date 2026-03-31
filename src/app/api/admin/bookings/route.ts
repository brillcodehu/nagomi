import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, scheduledClasses, classTypes } from "@/lib/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  const conditions = [];
  if (status) conditions.push(eq(bookings.status, status));
  if (dateFrom) conditions.push(gte(bookings.classDate, dateFrom));
  if (dateTo) conditions.push(lte(bookings.classDate, dateTo));

  const rows = await db
    .select({
      id: bookings.id,
      scheduled_class_id: bookings.scheduledClassId,
      class_date: bookings.classDate,
      customer_name: bookings.customerName,
      customer_email: bookings.customerEmail,
      customer_phone: bookings.customerPhone,
      status: bookings.status,
      payment_type: bookings.paymentType,
      amount_huf: bookings.amountHuf,
      created_at: bookings.createdAt,
      start_time: scheduledClasses.startTime,
      class_name: classTypes.name,
    })
    .from(bookings)
    .leftJoin(
      scheduledClasses,
      eq(bookings.scheduledClassId, scheduledClasses.id)
    )
    .leftJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(bookings.classDate), desc(bookings.createdAt))
    .limit(200);

  // Transform to match the expected frontend format
  const data = rows.map((r) => ({
    id: r.id,
    scheduled_class_id: r.scheduled_class_id,
    class_date: r.class_date,
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    customer_phone: r.customer_phone,
    status: r.status,
    payment_type: r.payment_type,
    amount_huf: r.amount_huf,
    created_at: r.created_at,
    scheduled_classes: r.start_time
      ? {
          start_time: r.start_time,
          class_types: r.class_name ? { name: r.class_name } : null,
        }
      : null,
  }));

  return NextResponse.json(data);
}
