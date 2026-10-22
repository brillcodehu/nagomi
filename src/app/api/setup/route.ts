import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { DEFAULT_ADMIN_EMAIL, seedIfEmpty } from "@/lib/db/seed";

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

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        seq SERIAL NOT NULL,
        stripe_checkout_session_id TEXT NOT NULL,
        kind TEXT NOT NULL,
        booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
        customer_pass_id UUID REFERENCES customer_passes(id) ON DELETE SET NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        description TEXT NOT NULL,
        amount_huf INT NOT NULL,
        provider TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'issued',
        invoice_number TEXT,
        provider_ref TEXT,
        error TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS invoices_unique_session_kind ON invoices(stripe_checkout_session_id, kind)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status)`);

    // Indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_class_date ON bookings(scheduled_class_id, class_date)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON bookings(stripe_checkout_session_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_scheduled_classes_day ON scheduled_classes(day_of_week)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_scheduled_classes_date ON scheduled_classes(specific_date)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_customer_passes_email ON customer_passes(customer_email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_customer_passes_active ON customer_passes(is_active, expires_at)`);
    try {
      await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS customer_passes_unique_session ON customer_passes(stripe_checkout_session_id)`);
    } catch (indexError) {
      // Már létező duplikált session-azonosító esetén kézi tisztítás kell.
      console.error("customer_passes egyedi index nem hozható létre:", indexError);
    }

    const seeded = await seedIfEmpty("Nagomi2026Pilates");
    if (!seeded) {
      return Response.json({ message: "Az adatbazis mar be van allitva." });
    }

    return Response.json({
      message: "Adatbazis sikeresen beallitva!",
      admin: `${DEFAULT_ADMIN_EMAIL} / Nagomi2026Pilates`,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return Response.json(
      { error: "Setup hiba", details: String(error) },
      { status: 500 }
    );
  }
}
