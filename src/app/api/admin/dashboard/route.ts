import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { format, startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
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
      // Mai orak szama
      supabase
        .from("scheduled_classes")
        .select("id", { count: "exact", head: true })
        .eq("day_of_week", todayDow)
        .eq("is_cancelled", false),
      // Mai foglalasok szama
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("class_date", todayStr)
        .in("status", ["pending", "confirmed"]),
      // Heti foglalasok es bevetel
      supabase
        .from("bookings")
        .select("id, amount_huf")
        .gte("class_date", weekStart)
        .lte("class_date", weekEnd)
        .in("status", ["pending", "confirmed"]) as unknown as Promise<{ data: { id: string; amount_huf: number | null }[] | null; error: unknown }>,
      // Aktiv berletek szama
      supabase
        .from("customer_passes")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .gt("remaining_occasions", 0)
        .gt("expires_at", new Date().toISOString()),
    ]);

  const weeklyRevenue =
    weekBookingsRes.data?.reduce((sum, b) => sum + (b.amount_huf ?? 0), 0) ?? 0;

  return NextResponse.json({
    today_classes: todayClassesRes.count ?? 0,
    today_bookings: todayBookingsRes.count ?? 0,
    weekly_bookings: weekBookingsRes.data?.length ?? 0,
    weekly_revenue: weeklyRevenue,
    active_passes: activePassesRes.count ?? 0,
  });
}
