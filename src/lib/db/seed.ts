import { db } from "@/lib/db";
import { classTypes, passTypes, instructors, scheduledClasses } from "@/lib/db/schema";
import { hash } from "bcryptjs";

export const DEFAULT_ADMIN_EMAIL = "antonia@nagomi-pilates.hu";

/**
 * Mintaadatok: óratípusok, bérlettípusok, admin oktató, heti órarend.
 * Csak üres adatbázisba tölt (ha van óratípus, nem csinál semmit).
 * Visszatér: true, ha betöltött.
 */
export async function seedIfEmpty(adminPassword: string): Promise<boolean> {
  const existing = await db.select({ id: classTypes.id }).from(classTypes).limit(1);
  if (existing.length > 0) return false;

  // Seed class types
  const [ct1, ct2, ct3, ct4] = await db.insert(classTypes).values([
    { name: "Reformer Alapok", slug: "reformer-alapok", description: "Ismerkedj meg a reformer geppel es a pilates alapelveivel.", tagline: "A testerzekeles elso lepesei", durationMin: 50, maxCapacity: 6, priceHuf: 4500, difficulty: 1, isPrivate: false, sortOrder: 1 },
    { name: "Reformer Flow", slug: "reformer-flow", description: "Folyamatos, aramlo mozdulatsorok a reformer gepen.", tagline: "Ero es elegancia egyensulya", durationMin: 55, maxCapacity: 6, priceHuf: 5000, difficulty: 2, isPrivate: false, sortOrder: 2 },
    { name: "Reformer Sculpt", slug: "reformer-sculpt", description: "Intenzivebb ora magasabb ellenallassal.", tagline: "Formald a tested precizoval", durationMin: 50, maxCapacity: 6, priceHuf: 5000, difficulty: 3, isPrivate: false, sortOrder: 3 },
    { name: "Privat Ora", slug: "privat-ora", description: "Kizarolag rad szabott edzesterv.", tagline: "Kizarolag rad szabva", durationMin: 55, maxCapacity: 1, priceHuf: 12000, difficulty: 0, isPrivate: true, sortOrder: 4 },
  ]).returning({ id: classTypes.id, slug: classTypes.slug });

  // Seed pass types
  await db.insert(passTypes).values([
    { name: "Proba alkalom", occasions: 1, priceHuf: 3500, validDays: 14, description: "Elso latogatashoz - kedvezmenyes probaora.", sortOrder: 1 },
    { name: "5 alkalmas berlet", occasions: 5, priceHuf: 20000, validDays: 30, description: "5 alkalom, 30 napos ervenyesseg.", sortOrder: 2 },
    { name: "10 alkalmas berlet", occasions: 10, priceHuf: 35000, validDays: 60, description: "10 alkalom, 60 napos ervenyesseg.", sortOrder: 3 },
  ]);

  // Seed admin instructor
  const passwordHash = await hash(adminPassword, 10);

  const [admin] = await db.insert(instructors).values([
    { name: "Antonia", email: DEFAULT_ADMIN_EMAIL, passwordHash, bio: "Studio tulajdonos es pilates oktato.", isActive: true },
  ]).returning({ id: instructors.id });

  // Seed schedule (class type slug -> id map)
  const ctMap = new Map(
    [ct1, ct2, ct3, ct4].map((ct) => [ct.slug, ct.id])
  );

  const scheduleData = [
    // Hetfo
    { slug: "reformer-alapok", dow: 1, time: "09:00" },
    { slug: "reformer-flow", dow: 1, time: "10:30" },
    { slug: "reformer-flow", dow: 1, time: "17:30" },
    { slug: "reformer-sculpt", dow: 1, time: "19:00" },
    // Kedd
    { slug: "reformer-sculpt", dow: 2, time: "08:00" },
    { slug: "reformer-alapok", dow: 2, time: "10:00" },
    { slug: "reformer-flow", dow: 2, time: "18:00" },
    // Szerda
    { slug: "reformer-alapok", dow: 3, time: "09:00" },
    { slug: "reformer-sculpt", dow: 3, time: "10:30" },
    { slug: "reformer-sculpt", dow: 3, time: "17:30" },
    { slug: "reformer-flow", dow: 3, time: "19:00" },
    // Csutortok
    { slug: "reformer-flow", dow: 4, time: "08:00" },
    { slug: "reformer-alapok", dow: 4, time: "10:00" },
    { slug: "reformer-alapok", dow: 4, time: "18:00" },
    { slug: "reformer-sculpt", dow: 4, time: "19:00" },
    // Pentek
    { slug: "reformer-sculpt", dow: 5, time: "09:00" },
    { slug: "reformer-flow", dow: 5, time: "10:30" },
    { slug: "reformer-flow", dow: 5, time: "17:00" },
    { slug: "reformer-alapok", dow: 5, time: "18:30" },
    // Szombat
    { slug: "reformer-alapok", dow: 6, time: "09:00" },
    { slug: "reformer-flow", dow: 6, time: "10:30" },
  ];

  await db.insert(scheduledClasses).values(
    scheduleData.map((s) => ({
      classTypeId: ctMap.get(s.slug)!,
      instructorId: admin.id,
      dayOfWeek: s.dow,
      startTime: s.time + ":00",
    }))
  );
  return true;
}
