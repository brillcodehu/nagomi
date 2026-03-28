import { format, addDays, startOfWeek, endOfWeek, isToday, isBefore, parseISO } from "date-fns";
import { hu } from "date-fns/locale";

const TIMEZONE = "Europe/Budapest";

/**
 * Az aktualis het hetfojet adja vissza
 */
export function getCurrentWeekStart(referenceDate: Date = new Date()): Date {
  return startOfWeek(referenceDate, { weekStartsOn: 1 });
}

/**
 * Het napjainak listajahoz
 */
export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

/**
 * Date -> ISO date string (YYYY-MM-DD)
 */
export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Date -> nap szama (1=hetfo..7=vasarnap, ISO)
 */
export function getIsoDayOfWeek(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

/**
 * Magyar datum formatum (pl. "marc. 28.")
 */
export function formatDateShort(date: Date): string {
  return format(date, "MMM d.", { locale: hu });
}

/**
 * Magyar teljes datum
 */
export function formatDateFull(date: Date): string {
  return format(date, "yyyy. MMMM d., EEEE", { locale: hu });
}

/**
 * Elmult-e mar az adott idopont (Europa/Budapest)
 */
export function isSlotInPast(dateStr: string, timeStr: string): boolean {
  const slotDate = new Date(`${dateStr}T${timeStr}`);
  return isBefore(slotDate, new Date());
}

/**
 * Mai nap-e
 */
export function isTodayDate(date: Date): boolean {
  return isToday(date);
}

/**
 * Het offset szoveg (pl. "Ezen a heten", "Kovetkezo het")
 */
export function getWeekLabel(weekStart: Date): string {
  const now = new Date();
  const currentWeekStart = getCurrentWeekStart(now);
  const diff = Math.round(
    (weekStart.getTime() - currentWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  if (diff === 0) return "Ezen a héten";
  if (diff === 1) return "Következő hét";
  if (diff === -1) return "Előző hét";
  return `${format(weekStart, "MMM d.", { locale: hu })} – ${format(
    addDays(weekStart, 6),
    "MMM d.",
    { locale: hu }
  )}`;
}
