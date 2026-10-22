"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */

export interface ScheduleSlot {
  id: string;
  classDate: string;
  className: string;
  classSlug: string;
  classTagline: string;
  startTime: string;
  durationMin: number;
  priceHuf: number;
  difficulty: number;
  isPrivate: boolean;
  instructorName: string;
  instructorAvatar: string | null;
  maxSpots: number;
  bookedSpots: number;
  availableSpots: number;
}

export interface ScheduleFilters {
  classType: string | null;
  instructor: string | null;
}

/* ═══════════════════════════════════════
   Date helpers
   ═══════════════════════════════════════ */

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isSameWeek(a: Date, b: Date): boolean {
  const mondayA = getMonday(a);
  const mondayB = getMonday(b);
  return mondayA.getTime() === mondayB.getTime();
}

const HU_MONTHS = [
  "jan.", "feb.", "márc.", "ápr.", "máj.", "jún.",
  "júl.", "aug.", "szept.", "okt.", "nov.", "dec.",
];

/* ═══════════════════════════════════════
   Hook
   ═══════════════════════════════════════ */

export function useSchedule() {
  const currentMonday = getMonday(new Date());
  const [weekStart, setWeekStart] = useState<Date>(currentMonday);
  const [filters, setFilters] = useState<ScheduleFilters>({
    classType: null,
    instructor: null,
  });

  // Az órarend az adatbázisból jön (/api/schedule), az admin felületen kezelt órák alapján.
  const [weekSlots, setWeekSlots] = useState<ScheduleSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const weekKey = formatDateISO(getMonday(weekStart));

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(false);
    fetch(`/api/schedule?weekStart=${weekKey}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { schedule: ScheduleSlot[] };
        setWeekSlots(
          data.schedule.map((s) => ({
            ...s,
            classTagline: s.classTagline ?? "",
            difficulty: s.difficulty ?? 0,
            isPrivate: Boolean(s.isPrivate),
          }))
        );
        setIsLoading(false);
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setWeekSlots([]);
        setLoadError(true);
        setIsLoading(false);
      });
    return () => controller.abort();
  }, [weekKey, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const slots = useMemo(() => {
    let result = weekSlots;

    if (filters.classType) {
      result = result.filter((s) => s.classSlug === filters.classType);
    }
    if (filters.instructor) {
      result = result.filter((s) => s.instructorName === filters.instructor);
    }

    return result;
  }, [weekSlots, filters]);

  const weekLabel = useMemo(() => {
    const today = new Date();
    if (isSameWeek(weekStart, today)) return "Ezen a héten";

    const mon = getMonday(weekStart);
    const sun = addDays(mon, 6);
    const monMonth = HU_MONTHS[mon.getMonth()];
    const sunMonth = HU_MONTHS[sun.getMonth()];

    if (mon.getMonth() === sun.getMonth()) {
      return `${monMonth} ${mon.getDate()}. - ${sun.getDate()}.`;
    }
    return `${monMonth} ${mon.getDate()}. - ${sunMonth} ${sun.getDate()}.`;
  }, [weekStart]);

  const goToPrevWeek = useCallback(() => {
    const prevMonday = addDays(getMonday(weekStart), -7);
    if (prevMonday >= currentMonday) {
      setWeekStart(prevMonday);
    }
  }, [weekStart, currentMonday]);

  const goToNextWeek = useCallback(() => {
    setWeekStart((prev) => addDays(getMonday(prev), 7));
  }, []);

  const canGoPrev = useMemo(() => {
    const prevMonday = addDays(getMonday(weekStart), -7);
    return prevMonday >= currentMonday;
  }, [weekStart, currentMonday]);

  const isCurrentWeek = useMemo(
    () => isSameWeek(weekStart, new Date()),
    [weekStart]
  );

  // Days of the week for grid rendering
  const weekDays = useMemo(() => {
    const monday = getMonday(weekStart);
    const dayNames = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    return dayNames.map((name, i) => {
      const date = addDays(monday, i);
      const dateStr = formatDateISO(date);
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const daySlots = slots.filter((s) => s.classDate === dateStr);
      const shortMonth = HU_MONTHS[date.getMonth()];
      return {
        name,
        date,
        dateStr,
        dateLabel: `${shortMonth} ${date.getDate()}.`,
        isToday,
        isPast: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        slots: daySlots,
      };
    });
  }, [weekStart, slots]);

  return {
    slots,
    weekStart,
    setWeekStart,
    filters,
    setFilters,
    weekLabel,
    weekDays,
    goToPrevWeek,
    goToNextWeek,
    canGoPrev,
    isCurrentWeek,
    isLoading,
    loadError,
    reload,
  };
}

export const FILTER_OPTIONS = [
  { label: "Mind", value: null },
  { label: "Reformer Alapok", value: "reformer-alapok" },
  { label: "Reformer Flow", value: "reformer-flow" },
  { label: "Reformer Sculpt", value: "reformer-sculpt" },
  { label: "Privát", value: "privat-ora" },
];

export const INSTRUCTOR_OPTIONS = [
  { label: "Mind", value: null },
  { label: "Kovács Anna", value: "Kovács Anna" },
  { label: "Nagy Eszter", value: "Nagy Eszter" },
];
