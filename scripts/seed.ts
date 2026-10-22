/**
 * Helyi mintaadatok: óratípusok, bérlettípusok, admin oktató, heti órarend.
 *
 *   DATABASE_URL=postgresql://postgres:dev@127.0.0.1:55482/nagomi \
 *   SEED_ADMIN_PASSWORD=... npm run seed
 *
 * Csak helyi adatbázisra fut (localhost / 127.0.0.1), éles DB-be nem ír.
 */
import { DEFAULT_ADMIN_EMAIL, seedIfEmpty } from "../src/lib/db/seed";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL hiányzik");
  const host = new URL(url).hostname;
  if (!["localhost", "127.0.0.1", "::1"].includes(host)) {
    throw new Error(`A seed csak helyi adatbázisra fut, a megadott host: ${host}`);
  }
  const password = process.env.SEED_ADMIN_PASSWORD || "Nagomi2026Pilates";
  const seeded = await seedIfEmpty(password);
  console.log(
    seeded
      ? `Mintaadatok betöltve. Admin: ${DEFAULT_ADMIN_EMAIL}`
      : "Az adatbázis már tartalmaz óratípust, nem töltöttem be semmit."
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
