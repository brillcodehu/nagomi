/**
 * HUF osszeg formatazo (pl. 5000 -> "5 000 Ft")
 */
export function formatHuf(amount: number): string {
  return (
    new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
  );
}

/**
 * Rovid ido formatum (pl. "09:00")
 */
export function formatTime(time: string): string {
  // TIME tipus: "09:00:00" -> "09:00"
  return time.slice(0, 5);
}

/**
 * Magyar nap nevek
 */
const DAY_NAMES_HU: Record<number, string> = {
  1: "Hétfő",
  2: "Kedd",
  3: "Szerda",
  4: "Csütörtök",
  5: "Péntek",
  6: "Szombat",
  7: "Vasárnap",
};

export function getDayName(dayOfWeek: number): string {
  return DAY_NAMES_HU[dayOfWeek] ?? "";
}

/**
 * Magyar rovid nap nevek
 */
const DAY_SHORT_HU: Record<number, string> = {
  1: "H",
  2: "K",
  3: "Sze",
  4: "Cs",
  5: "P",
  6: "Szo",
  7: "V",
};

export function getDayShort(dayOfWeek: number): string {
  return DAY_SHORT_HU[dayOfWeek] ?? "";
}

/**
 * Datum formatazo (pl. "2026-03-28" -> "márc. 28, szombat")
 */
export function formatDateHu(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("hu-HU", {
    month: "short",
    day: "numeric",
    weekday: "long",
  });
}

/**
 * Datum formatazo hosszu (pl. "2026. március 28.")
 */
export function formatDateLongHu(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
