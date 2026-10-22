import { E2E_ENV } from "./env";
import { resetMailLog, sql } from "./helpers";
import { hash } from "bcryptjs";

/**
 * A próbák előtt: csak helyi adatbázison fut, a foglalási és számla-adatokat
 * törli, a mintaadatokat (órarend, óratípusok, bérlettípusok) és a próba-admin
 * jelszavát biztosítja.
 */
export default async function globalSetup() {
  const host = new URL(E2E_ENV.DATABASE_URL).hostname;
  if (!["127.0.0.1", "localhost", "::1"].includes(host)) {
    throw new Error(`Az E2E csomag csak helyi adatbázisra fut, a megadott host: ${host}`);
  }
  const db = sql();
  try {
    await db`truncate invoices, bookings, customer_passes restart identity cascade`;
    await db`delete from settings`;
    const [{ n }] = await db`select count(*)::int as n from scheduled_classes where is_cancelled = false and specific_date is null`;
    if (n < 5) throw new Error("Az órarend üres: futtasd előbb az npm run seed parancsot");
    const passwordHash = await hash(E2E_ENV.SEED_ADMIN_PASSWORD, 10);
    await db`update instructors set password_hash = ${passwordHash} where email = 'antonia@nagomi-pilates.hu'`;
  } finally {
    await db.end();
  }
  resetMailLog();
}
