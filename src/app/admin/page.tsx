import { db } from "@/lib/db";
import {
  scheduledClasses,
  classTypes,
  instructors,
  bookings,
  customerPasses,
} from "@/lib/db/schema";
import { eq, and, inArray, gte, lte, gt, desc, sql } from "drizzle-orm";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { hu } from "date-fns/locale";
import Link from "next/link";

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
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const todayDow = today.getDay() === 0 ? 7 : today.getDay();
  const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");

  // Mai orak
  const todayClasses = await db
    .select({
      id: scheduledClasses.id,
      startTime: scheduledClasses.startTime,
      maxSpotsOverride: scheduledClasses.maxSpotsOverride,
      ctName: classTypes.name,
      ctMaxCapacity: classTypes.maxCapacity,
      instName: instructors.name,
    })
    .from(scheduledClasses)
    .innerJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
    .innerJoin(instructors, eq(scheduledClasses.instructorId, instructors.id))
    .where(
      and(
        eq(scheduledClasses.dayOfWeek, todayDow),
        eq(scheduledClasses.isCancelled, false)
      )
    )
    .orderBy(scheduledClasses.startTime);

  // Mai foglalasok
  const todayBookings = await db
    .select({
      id: bookings.id,
      scheduledClassId: bookings.scheduledClassId,
      amountHuf: bookings.amountHuf,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.classDate, todayStr),
        inArray(bookings.status, ["pending", "confirmed"])
      )
    );

  // Heti foglalasok
  const weekBookings = await db
    .select({ id: bookings.id, amountHuf: bookings.amountHuf })
    .from(bookings)
    .where(
      and(
        gte(bookings.classDate, weekStart),
        lte(bookings.classDate, weekEnd),
        inArray(bookings.status, ["pending", "confirmed"])
      )
    );

  // Utolso 10 foglalas
  const recentBookings = await db
    .select({
      id: bookings.id,
      customerName: bookings.customerName,
      status: bookings.status,
      classDate: bookings.classDate,
      amountHuf: bookings.amountHuf,
      startTime: scheduledClasses.startTime,
      ctName: classTypes.name,
    })
    .from(bookings)
    .leftJoin(scheduledClasses, eq(bookings.scheduledClassId, scheduledClasses.id))
    .leftJoin(classTypes, eq(scheduledClasses.classTypeId, classTypes.id))
    .orderBy(desc(bookings.createdAt))
    .limit(10);

  // Aktiv berletek
  const [activePassesResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(customerPasses)
    .where(
      and(
        eq(customerPasses.isActive, true),
        gt(customerPasses.remainingOccasions, 0),
        gt(customerPasses.expiresAt, new Date())
      )
    );

  const weeklyBookingCount = weekBookings.length;
  const weeklyRevenue = weekBookings.reduce((sum, b) => sum + (b.amountHuf ?? 0), 0);

  const todayClassesWithCounts = todayClasses.map((cls) => {
    const bookingCount = todayBookings.filter(
      (b) => b.scheduledClassId === cls.id
    ).length;
    const maxSpots = cls.maxSpotsOverride ?? cls.ctMaxCapacity;
    return {
      id: cls.id,
      time: cls.startTime?.slice(0, 5),
      name: cls.ctName,
      instructor: cls.instName,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Mai orak" value={todayClassesWithCounts.length} />
        <StatCard label="Heti foglalasok" value={weeklyBookingCount} />
        <StatCard
          label="Heti bevetel"
          value={`${weeklyRevenue.toLocaleString("hu-HU")} Ft`}
        />
        <StatCard label="Aktiv berletek" value={activePassesResult?.count ?? 0} />
      </div>

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

        {recentBookings.length === 0 ? (
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
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {booking.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                      {booking.ctName ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {booking.classDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_STYLES[booking.status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABELS[booking.status] ?? booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {booking.amountHuf
                        ? `${booking.amountHuf.toLocaleString("hu-HU")} Ft`
                        : "-"}
                    </td>
                  </tr>
                ))}
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
