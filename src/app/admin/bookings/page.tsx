"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronDown } from "lucide-react";

interface BookingRow {
  id: string;
  scheduled_class_id: string;
  class_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  payment_type: string;
  amount_huf: number | null;
  created_at: string;
  scheduled_classes: {
    start_time: string;
    class_types: { name: string } | null;
  } | null;
}

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

const PAYMENT_LABELS: Record<string, string> = {
  stripe: "Online (Stripe)",
  pass: "Berlet",
  cash: "Keszpenz",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);

    const res = await fetch(`/api/admin/bookings?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setBookings(data);
    }
    setLoading(false);
  }, [statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(bookingId: string, newStatus: string) {
    setActionLoading(bookingId);
    const res = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      await fetchBookings();
    }
    setActionLoading(null);
  }

  const filtered = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.customer_name.toLowerCase().includes(q) ||
      b.customer_email.toLowerCase().includes(q) ||
      b.customer_phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Foglalasok
      </h1>

      {/* Szurok */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Kereses
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nev, email, telefon..."
                className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Statusz
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Osszes</option>
              <option value="pending">Fuggben</option>
              <option value="confirmed">Megerositett</option>
              <option value="cancelled">Lemondott</option>
              <option value="no_show">Nem jelent meg</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Datum -tol
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Datum -ig
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Foglalasok lista */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Betoltes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          Nincsenek foglalasok a szuroknek megfeleloen.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Datum
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Ido
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Ora
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Nev
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  Telefon
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Statusz
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Fizetes
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Muveletek
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((booking) => {
                const sc = booking.scheduled_classes;
                const isExpanded = expandedId === booking.id;
                return (
                  <tr
                    key={booking.id}
                    className="group"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {booking.class_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                      {sc?.start_time?.slice(0, 5) ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {sc?.class_types?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground font-medium">
                      {booking.customer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {booking.customer_email}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                      {booking.customer_phone}
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
                      {PAYMENT_LABELS[booking.payment_type] ??
                        booking.payment_type}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : booking.id)
                          }
                          disabled={actionLoading === booking.id}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="absolute right-0 top-full mt-1 z-10 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                            {booking.status !== "confirmed" && (
                              <button
                                onClick={() =>
                                  updateStatus(booking.id, "confirmed")
                                }
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                Megerosites
                              </button>
                            )}
                            {booking.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  updateStatus(booking.id, "cancelled")
                                }
                                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                Lemondas
                              </button>
                            )}
                            {booking.status !== "no_show" && (
                              <button
                                onClick={() =>
                                  updateStatus(booking.id, "no_show")
                                }
                                className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                              >
                                Nem jelent meg
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
