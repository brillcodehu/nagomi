import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  scheduledClasses,
  bookings,
  customerPasses,
} from "@/lib/db/schema";
import { eq, and, inArray, gte, lte, gt, sql } from "drizzle-orm";
import { format, startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const todayDow = today.getDay() === 0 ? 7 : today.getDay();
  const weekStart = format(
    startOfWeek(today, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");

  const [todayClassesRes, todayBookingsRes, weekBookingsRes, activePassesRes] =
    await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(scheduledClasses)
        .where(
          and(
            eq(scheduledClasses.dayOfWeek, todayDow),
            eq(scheduledClasses.isCancelled, false)
          )
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(bookings)
        .where(
          and(
            eq(bookings.classDate, todayStr),
            inArray(bookings.status, ["pending", "confirmed"])
          )
        ),
      db
        .select({ id: bookings.id, amountHuf: bookings.amountHuf })
        .from(bookings)
        .where(
          and(
            gte(bookings.classDate, weekStart),
            lte(bookings.classDate, weekEnd),
            inArray(bookings.status, ["pending", "confirmed"])
          )
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(customerPasses)
        .where(
          and(
            eq(customerPasses.isActive, true),
            gt(customerPasses.remainingOccasions, 0),
            gt(customerPasses.expiresAt, new Date())
          )
        ),
    ]);

  const weeklyRevenue =
    weekBookingsRes.reduce((sum, b) => sum + (b.amountHuf ?? 0), 0);

  return NextResponse.json({
    today_classes: todayClassesRes[0]?.count ?? 0,
    today_bookings: todayBookingsRes[0]?.count ?? 0,
    weekly_bookings: weekBookingsRes.length,
    weekly_revenue: weeklyRevenue,
    active_passes: activePassesRes[0]?.count ?? 0,
  });
}
