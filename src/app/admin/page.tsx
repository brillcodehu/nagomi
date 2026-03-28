import { createClient } from "@/lib/supabase/server";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { hu } from "date-fns/locale";
import Link from "next/link";

const DAY_NAMES: Record<number, string> = {
  1: "Hetfo",
  2: "Kedd",
  3: "Szerda",
  4: "Csutortok",
  5: "Pentek",
  6: "Szombat",
  7: "Vasarnap",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Fuggben",
  confirmed: "Megerositett",
  cancelled: "Lemondott",
  no_show: "Nem jelent meg",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const todayDow = today.getDay() === 0 ? 7 : today.getDay();
  const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");

  // Mai orak a foglalasok szamaval
  const { data: todayClasses } = await supabase
    .from("scheduled_classes")
    .select("id, start_time, max_spots_override, class_types(name, max_capacity, price_huf), instructors(name)")
    .eq("day_of_week", todayDow)
    .eq("is_cancelled", false)
    .order("start_time") as { data: { id: string; start_time: string; max_spots_override: number | null; class_types: { name: string; max_capacity: number; price_huf: number } | null; instructors: { name: string } | null }[] | null };

  // Mai foglalas szamok ora szerint
  const { data: todayBookings } = await supabase
    .from("bookings")
    .select("id, scheduled_class_id, status, amount_huf")
    .eq("class_date", todayStr)
    .in("status", ["pending", "confirmed"]) as { data: { id: string; scheduled_class_id: string; status: string; amount_huf: number | null }[] | null };

  // Heti osszes foglalas es bevetel
  const { data: weekBookings } = await supabase
    .from("bookings")
    .select("id, status, amount_huf")
    .gte("class_date", weekStart)
    .lte("class_date", weekEnd)
    .in("status", ["pending", "confirmed"]) as { data: { id: string; status: string; amount_huf: number | null }[] | null };

  // Utolso 10 foglalas
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("id, customer_name, customer_email, status, payment_type, class_date, created_at, amount_huf, scheduled_classes(start_time, class_types(name))")
    .order("created_at", { ascending: false })
    .limit(10) as { data: { id: string; customer_name: string; customer_email: string; status: string; payment_type: string | null; class_date: string; created_at: string; amount_huf: number | null; scheduled_classes: { start_time: string; class_types: { name: string } | null } | null }[] | null };

  // Aktiv berletek szama
  const { count: activePassesCount } = await supabase
    .from("customer_passes")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .gt("remaining_occasions", 0)
    .gt("expires_at", new Date().toISOString());

  // Statisztikak szamolasa
  const weeklyBookingCount = weekBookings?.length ?? 0;
  const weeklyRevenue = weekBookings?.reduce((sum, b) => sum + (b.amount_huf ?? 0), 0) ?? 0;

  // Mai orak booking count-tal
  const todayClassesWithCounts = (todayClasses ?? []).map((cls) => {
    const classType = cls.class_types as { name: string; max_capacity: number; price_huf: number } | null;
    const instructor = cls.instructors as { name: string } | null;
    const bookingCount = (todayBookings ?? []).filter(
      (b) => b.scheduled_class_id === cls.id
    ).length;
    const maxSpots = cls.max_spots_override ?? classType?.max_capacity ?? 0;
    return {
      id: cls.id,
      time: cls.start_time?.slice(0, 5),
      name: classType?.name ?? "Ismeretlen",
      instructor: instructor?.name ?? "N/A",
      bookingCount,
      maxSpots,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {format(today, "yyyy. MMMM d., EEEE", { locale: hu })}
        </p>
      </div>

      {/* Statisztika kartyak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Mai orak"
          value={todayClassesWithCounts.length}
        />
        <StatCard
          label="Heti foglalasok"
          value={weeklyBookingCount}
        />
        <StatCard
          label="Heti bevetel"
          value={`${weeklyRevenue.toLocaleString("hu-HU")} Ft`}
        />
        <StatCard
          label="Aktiv berletek"
          value={activePassesCount ?? 0}
        />
      </div>

      {/* Mai orak */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Mai orak
          </h2>
          <Link
            href="/admin/schedule"
            className="text-sm text-primary hover:underline"
          >
            Osszes orarend
          </Link>
        </div>

        {todayClassesWithCounts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            Ma nincsenek orak.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Idopont
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Ora
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Oktato
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Foglaltsag
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {todayClassesWithCounts.map((cls) => (
                  <tr key={cls.id}>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {cls.time}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {cls.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {cls.instructor}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`font-medium ${
                          cls.bookingCount >= cls.maxSpots
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {cls.bookingCount}/{cls.maxSpots}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Legutobbi foglalasok */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Legutobbi foglalasok
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-primary hover:underline"
          >
            Osszes foglalas
          </Link>
        </div>

        {!recentBookings || recentBookings.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
            Meg nincsenek foglalasok.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nev
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Ora
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Statusz
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Osszeg
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentBookings.map((booking) => {
                  const sc = booking.scheduled_classes as { start_time: string; class_types: { name: string } | null } | null;
                  return (
                    <tr key={booking.id}>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {booking.customer_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {sc?.class_types?.name ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {booking.class_date}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_STYLES[booking.status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {STATUS_LABELS[booking.status] ?? booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                        {booking.amount_huf
                          ? `${booking.amount_huf.toLocaleString("hu-HU")} Ft`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-semibold text-foreground mt-2">{value}</p>
    </div>
  );
}
