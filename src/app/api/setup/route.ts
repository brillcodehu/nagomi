import { db } from "@/lib/db";
import { classTypes, passTypes, instructors, scheduledClasses } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { hash } from "bcryptjs";

export const dynamic = "force-dynamic";

/**
 * GET /api/setup
 *
 * Egyszer futtatando: letrehozza a tablakat, seed adatokat es az admin usert.
 * Hivd meg a bongeszeben: https://nagomi-pilates.hu/api/setup
 */
export async function GET() {
  try {
    // Create tables first
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS class_types (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        tagline TEXT,
        duration_min INT NOT NULL DEFAULT 50,
        max_capacity INT NOT NULL DEFAULT 6,
        price_huf INT NOT NULL,
        difficulty INT DEFAULT 1,
        is_private BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS pass_types (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        occasions INT NOT NULL,
        price_huf INT NOT NULL,
        valid_days INT NOT NULL DEFAULT 30,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS instructors (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT,
        bio TEXT,
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS scheduled_classes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        class_type_id UUID NOT NULL REFERENCES class_types(id) ON DELETE CASCADE,
        instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
        day_of_week INT,
        start_time TIME NOT NULL,
        specific_date DATE,
        max_spots_override INT,
        is_cancelled BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        CHECK (day_of_week IS NOT NULL OR specific_date IS NOT NULL),
        CHECK (day_of_week IS NULL OR (day_of_week >= 1 AND day_of_week <= 7))
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS customer_passes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        pass_type_id UUID NOT NULL REFERENCES pass_types(id),
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        remaining_occasions INT NOT NULL,
        purchased_at TIMESTAMPTZ DEFAULT now(),
        expires_at TIMESTAMPTZ NOT NULL,
        stripe_payment_intent_id TEXT,
        stripe_checkout_session_id TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        scheduled_class_id UUID NOT NULL REFERENCES scheduled_classes(id) ON DELETE CASCADE,
        class_date DATE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'confirmed', 'cancelled', 'no_show')),
        payment_type TEXT NOT NULL
          CHECK (payment_type IN ('stripe', 'pass')),
        stripe_payment_intent_id TEXT,
        stripe_checkout_session_id TEXT,
        pass_id UUID REFERENCES customer_passes(id),
        amount_huf INT,
        cancelled_at TIMESTAMPTZ,
        cancellation_reason TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(scheduled_class_id, class_date, customer_email)
      )
    `);

    // Indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_class_date ON bookings(scheduled_class_id, class_date)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON bookings(stripe_checkout_session_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_scheduled_classes_day ON scheduled_classes(day_of_week)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_scheduled_classes_date ON scheduled_classes(specific_date)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_customer_passes_email ON customer_passes(customer_email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_customer_passes_active ON customer_passes(is_active, expires_at)`);

    // Check if already seeded
    const existing = await db.select({ id: classTypes.id }).from(classTypes).limit(1);
    if (existing.length > 0) {
      return Response.json({ message: "Az adatbazis mar be van allitva." });
    }

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
    const passwordHash = await hash("Nagomi2026Pilates", 10);

    const [admin] = await db.insert(instructors).values([
      { name: "Antonia", email: "antonia@nagomi-pilates.hu", passwordHash, bio: "Studio tulajdonos es pilates oktato.", isActive: true },
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

    return Response.json({
      message: "Adatbazis sikeresen beallitva!",
      admin: "antonia@nagomi-pilates.hu / Nagomi2026Pilates",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return Response.json(
      { error: "Setup hiba", details: String(error) },
      { status: 500 }
    );
  }
}
