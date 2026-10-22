import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";

/**
 * A jogi oldalak adatai az admin felületen szerkeszthetők (settings tábla).
 * Hiányzó érték soha nem kap kitalált alapértéket: az oldal "megadandó" jelzést mutat.
 */
export const LEGAL_FIELDS = [
  { key: "operator_name", label: "Üzemeltető neve (cég vagy egyéni vállalkozó)" },
  { key: "operator_address", label: "Székhely" },
  { key: "tax_number", label: "Adószám" },
  { key: "registration_number", label: "Cégjegyzékszám vagy nyilvántartási szám" },
  { key: "hosting_provider", label: "Tárhelyszolgáltató neve és címe" },
  { key: "dpo_contact", label: "Adatkezelési kapcsolattartó e-mail (ha eltér a kapcsolati e-mailtől)" },
] as const;

export type LegalKey = (typeof LEGAL_FIELDS)[number]["key"];
export type LegalSettings = Record<LegalKey, string>;

const EMPTY: LegalSettings = {
  operator_name: "",
  operator_address: "",
  tax_number: "",
  registration_number: "",
  hosting_provider: "",
  dpo_contact: "",
};

export async function getLegalSettings(): Promise<LegalSettings> {
  const result: LegalSettings = { ...EMPTY };
  try {
    const rows = await db.select().from(settings);
    for (const row of rows) {
      if (row.key in result) {
        result[row.key as LegalKey] = (row.value ?? "").trim();
      }
    }
  } catch (error) {
    // A tábla az éles adatbázisban még nem biztos, hogy létezik: az oldal
    // ilyenkor is megjelenik, minden mező "megadandó" jelzéssel.
    console.error("Jogi beállítások olvasása sikertelen:", error);
  }
  return result;
}

export async function saveLegalSettings(values: Partial<LegalSettings>) {
  for (const field of LEGAL_FIELDS) {
    const raw = values[field.key];
    if (typeof raw !== "string") continue;
    const value = raw.trim().slice(0, 500);
    await db
      .insert(settings)
      .values({ key: field.key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() },
      });
  }
}
