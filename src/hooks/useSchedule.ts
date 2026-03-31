"use client";

import { useState, useMemo, useCallback } from "react";

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
   Seed data generator
   ═══════════════════════════════════════ */

const CLASS_TYPES = [
  {
    name: "Reformer Alapok",
    slug: "reformer-alapok",
    tagline: "A testérzékelés első lépései",
    price: 4500,
    difficulty: 1,
    isPrivate: false,
    maxSpots: 6,
  },
  {
    name: "Reformer Flow",
    slug: "reformer-flow",
    tagline: "Erő és elegancia egyensúlya",
    price: 5000,
    difficulty: 2,
    isPrivate: false,
    maxSpots: 6,
  },
  {
    name: "Reformer Sculpt",
    slug: "reformer-sculpt",
    tagline: "Formáld a tested precízióval",
    price: 5000,
    difficulty: 3,
    isPrivate: false,
    maxSpots: 6,
  },
  {
    name: "Privát Óra",
    slug: "privat-ora",
    tagline: "Kizárólag rád szabva",
    price: 12000,
    difficulty: 0,
    isPrivate: true,
    maxSpots: 1,
  },
];

const INSTRUCTORS = ["Kovács Anna", "Nagy Eszter"];

// Deterministic pseudo-random based on string seed
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash % 100) / 100;
}

function generateWeekSlots(monday: Date): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];

  // Monday-Friday schedule templates
  const weekdayTemplates = [
    // Monday
    [
      { time: "09:00", classIdx: 0, instrIdx: 0 },
      { time: "11:00", classIdx: 1, instrIdx: 1 },
      { time: "17:00", classIdx: 2, instrIdx: 0 },
      { time: "18:30", classIdx: 3, instrIdx: 1 },
    ],
    // Tuesday
    [
      { time: "08:00", classIdx: 1, instrIdx: 0 },
      { time: "10:00", classIdx: 0, instrIdx: 1 },
      { time: "17:30", classIdx: 2, instrIdx: 0 },
    ],
    // Wednesday
    [
      { time: "09:00", classIdx: 2, instrIdx: 1 },
      { time: "11:00", classIdx: 0, instrIdx: 0 },
      { time: "16:00", classIdx: 3, instrIdx: 0 },
      { time: "18:00", classIdx: 1, instrIdx: 1 },
    ],
    // Thursday
    [
      { time: "08:00", classIdx: 0, instrIdx: 1 },
      { time: "10:00", classIdx: 1, instrIdx: 0 },
      { time: "17:00", classIdx: 2, instrIdx: 1 },
      { time: "19:00", classIdx: 1, instrIdx: 0 },
    ],
    // Friday
    [
      { time: "09:00", classIdx: 1, instrIdx: 1 },
      { time: "11:00", classIdx: 0, instrIdx: 0 },
      { time: "16:00", classIdx: 2, instrIdx: 1 },
    ],
    // Saturday
    [
      { time: "09:00", classIdx: 1, instrIdx: 0 },
      { time: "11:00", classIdx: 0, instrIdx: 1 },
    ],
    // Sunday (empty)
    [],
  ];

  weekdayTemplates.forEach((dayTemplate, dayOffset) => {
    const date = addDays(monday, dayOffset);
    const dateStr = formatDateISO(date);

    dayTemplate.forEach((item, slotIdx) => {
      const cls = CLASS_TYPES[item.classIdx];
      const instructor = INSTRUCTORS[item.instrIdx];
      const seed = `${dateStr}-${item.time}-${slotIdx}`;
      const rand = seededRandom(seed);

      const bookedSpots = cls.isPrivate
        ? (rand > 0.4 ? 1 : 0)
        : Math.min(cls.maxSpots, Math.floor(rand * 6) + 1);

      slots.push({
        id: `slot-${dateStr}-${item.time.replace(":", "")}`,
        classDate: dateStr,
        className: cls.name,
        classSlug: cls.slug,
        classTagline: cls.tagline,
        startTime: item.time,
        durationMin: cls.isPrivate ? 55 : 50,
        priceHuf: cls.price,
        difficulty: cls.difficulty,
        isPrivate: cls.isPrivate,
        instructorName: instructor,
        instructorAvatar: null,
        maxSpots: cls.maxSpots,
        bookedSpots,
        availableSpots: cls.maxSpots - bookedSpots,
      });
    });
  });

  return slots;
}

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

  const slots = useMemo(() => {
    const monday = getMonday(weekStart);
    let result = generateWeekSlots(monday);

    if (filters.classType) {
      result = result.filter((s) => s.classSlug === filters.classType);
    }
    if (filters.instructor) {
      result = result.filter((s) => s.instructorName === filters.instructor);
    }

    return result;
  }, [weekStart, filters]);

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
    isLoading: false, // Will become true when connected to API
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
