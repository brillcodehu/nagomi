-- ============================================================
-- NAGOMI PILATES - FOGLALÁSI RENDSZER
-- Teljes adatbázis schema, függvények, RLS, seed data
-- ============================================================

-- Oratipusok
CREATE TABLE class_types (
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
);

-- Berlet tipusok
CREATE TABLE pass_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  occasions INT NOT NULL,
  price_huf INT NOT NULL,
  valid_days INT NOT NULL DEFAULT 30,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Oktatok
CREATE TABLE instructors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Utemezett orak
CREATE TABLE scheduled_classes (
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
);

-- Vasarolt berletek (elobb kell mint a bookings tábla a FK miatt)
CREATE TABLE customer_passes (
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
);

-- Foglalasok
CREATE TABLE bookings (
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
);

-- Indexek
CREATE INDEX idx_bookings_class_date ON bookings(scheduled_class_id, class_date);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_stripe_session ON bookings(stripe_checkout_session_id);
CREATE INDEX idx_scheduled_classes_day ON scheduled_classes(day_of_week);
CREATE INDEX idx_scheduled_classes_date ON scheduled_classes(specific_date);
CREATE INDEX idx_customer_passes_email ON customer_passes(customer_email);
CREATE INDEX idx_customer_passes_active ON customer_passes(is_active, expires_at);

-- ============================================================
-- BOOKING FUNCTION (versenyhelyzet-biztos)
-- ============================================================

CREATE OR REPLACE FUNCTION book_class(
  p_scheduled_class_id UUID,
  p_class_date DATE,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_payment_type TEXT,
  p_stripe_session_id TEXT DEFAULT NULL,
  p_pass_id UUID DEFAULT NULL,
  p_amount_huf INT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_max_spots INT;
  v_current_bookings INT;
  v_booking_id UUID;
BEGIN
  -- Row lock
  SELECT COALESCE(sc.max_spots_override, ct.max_capacity)
  INTO v_max_spots
  FROM scheduled_classes sc
  JOIN class_types ct ON ct.id = sc.class_type_id
  WHERE sc.id = p_scheduled_class_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CLASS_NOT_FOUND';
  END IF;

  -- Aktualis foglalasok
  SELECT COUNT(*) INTO v_current_bookings
  FROM bookings
  WHERE scheduled_class_id = p_scheduled_class_id
    AND class_date = p_class_date
    AND status IN ('pending', 'confirmed');

  IF v_current_bookings >= v_max_spots THEN
    RAISE EXCEPTION 'CLASS_FULL';
  END IF;

  -- Berlet eseten: occasion levonasa
  IF p_payment_type = 'pass' AND p_pass_id IS NOT NULL THEN
    UPDATE customer_passes
    SET remaining_occasions = remaining_occasions - 1
    WHERE id = p_pass_id
      AND remaining_occasions > 0
      AND is_active = true
      AND expires_at > now();
    IF NOT FOUND THEN
      RAISE EXCEPTION 'PASS_INVALID';
    END IF;
  END IF;

  -- Foglalas letrehozasa
  INSERT INTO bookings (
    scheduled_class_id, class_date, customer_name,
    customer_email, customer_phone, status,
    payment_type, stripe_checkout_session_id,
    pass_id, amount_huf
  ) VALUES (
    p_scheduled_class_id, p_class_date, p_customer_name,
    p_customer_email, p_customer_phone,
    CASE WHEN p_payment_type = 'pass' THEN 'confirmed' ELSE 'pending' END,
    p_payment_type, p_stripe_session_id,
    p_pass_id, p_amount_huf
  ) RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE class_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE pass_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_passes ENABLE ROW LEVEL SECURITY;

-- Publikus olvasas (frontend)
CREATE POLICY "class_types_public_read" ON class_types
  FOR SELECT USING (true);

CREATE POLICY "pass_types_public_read" ON pass_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "instructors_public_read" ON instructors
  FOR SELECT USING (is_active = true);

CREATE POLICY "scheduled_classes_public_read" ON scheduled_classes
  FOR SELECT USING (is_cancelled = false);

-- Bookings: publikus insert (a book_class function SECURITY DEFINER-rel fut)
-- Publikus olvasas sajat foglalasokhoz (email alapjan nem tudunk szurni RLS-sel,
-- ezert a bookings olvasas az API route-okon keresztul tortenik service role-lal)

-- Admin policyk (auth.uid() == instructors.auth_user_id)
CREATE POLICY "admin_class_types_all" ON class_types
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "admin_pass_types_all" ON pass_types
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "admin_instructors_all" ON instructors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "admin_scheduled_classes_all" ON scheduled_classes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "admin_bookings_all" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "admin_customer_passes_all" ON customer_passes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM instructors WHERE auth_user_id = auth.uid())
  );

-- ============================================================
-- VIEW: orarend szabad helyekkel
-- ============================================================

CREATE OR REPLACE VIEW schedule_with_availability AS
SELECT
  sc.id,
  sc.class_type_id,
  sc.instructor_id,
  sc.day_of_week,
  sc.start_time,
  sc.specific_date,
  sc.max_spots_override,
  sc.is_cancelled,
  sc.notes,
  ct.name AS class_name,
  ct.slug AS class_slug,
  ct.description AS class_description,
  ct.tagline AS class_tagline,
  ct.duration_min,
  ct.price_huf,
  ct.difficulty,
  ct.is_private,
  COALESCE(sc.max_spots_override, ct.max_capacity) AS max_spots,
  i.name AS instructor_name,
  i.avatar_url AS instructor_avatar
FROM scheduled_classes sc
JOIN class_types ct ON ct.id = sc.class_type_id
JOIN instructors i ON i.id = sc.instructor_id
WHERE sc.is_cancelled = false
  AND i.is_active = true;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Oratipusok
INSERT INTO class_types (name, slug, description, tagline, duration_min, max_capacity, price_huf, difficulty, is_private, sort_order) VALUES
  ('Reformer Alapok', 'reformer-alapok',
   'Ismerkedj meg a reformer géppel és a pilates alapelveivel. Oktatónk lépésről lépésre vezet végig az alapgyakorlatokon, figyelembe véve a tested egyedi adottságait.',
   'A testérzékelés első lépései', 50, 6, 4500, 1, false, 1),
  ('Reformer Flow', 'reformer-flow',
   'A stúdió zászlóshajó órája. Folyamatos, áramló mozdulatsorok a reformer gépen, amik egyszerre formálják a tested és nyugtatják az elméd.',
   'Erő és elegancia egyensúlya', 55, 6, 5000, 2, false, 2),
  ('Reformer Sculpt', 'reformer-sculpt',
   'Intenzívebb óra magasabb ellenállással és összetettebb gyakorlatokkal. Célzott izomcsoportokat dolgozunk meg a maximális hatékonyságért.',
   'Formáld a tested precízióval', 50, 6, 5000, 3, false, 3),
  ('Privát Óra', 'privat-ora',
   'Kizárólag rád szabott edzésterv, egy-az-egyben oktatói figyelemmel. Ideális célzott problémák kezelésére vagy gyorsított fejlődésre.',
   'Kizárólag rád szabva', 55, 1, 12000, 0, true, 4);

-- Berlet tipusok
INSERT INTO pass_types (name, occasions, price_huf, valid_days, description, sort_order) VALUES
  ('Próba alkalom', 1, 3500, 14,
   'Első látogatáshoz – kedvezményes próbaóra bármely csoportos foglalkozásra.', 1),
  ('5 alkalmas bérlet', 5, 20000, 30,
   '5 alkalom, 30 napos érvényesség. Alkalmanként 4 000 Ft.', 2),
  ('10 alkalmas bérlet', 10, 35000, 60,
   '10 alkalom, 60 napos érvényesség. Alkalmanként 3 500 Ft – a legjobb ár!', 3);

-- Oktatok (auth_user_id-t majd a Supabase Auth user letrehozasa utan kell frissiteni)
INSERT INTO instructors (name, email, bio) VALUES
  ('Kovács Anna', 'anna@nagomipilates.hu',
   'Certified Pilates oktató, 8 éves tapasztalattal. Specialitása a rehabilitációs pilates és a kezdők oktatása.'),
  ('Nagy Eszter', 'eszter@nagomipilates.hu',
   'STOTT Pilates minősítésű oktató. Mozgásterápiás háttérrel, az intenzív és flow órák szakértője.');

-- Heti orarend (hetfo-pentek)
-- Anna orai
INSERT INTO scheduled_classes (class_type_id, instructor_id, day_of_week, start_time)
SELECT ct.id, i.id, dow, t::TIME
FROM (VALUES
  ('reformer-alapok', 1, '09:00'),
  ('reformer-flow',   1, '17:30'),
  ('reformer-sculpt', 2, '08:00'),
  ('reformer-flow',   2, '18:00'),
  ('reformer-alapok', 3, '09:00'),
  ('reformer-sculpt', 3, '17:30'),
  ('reformer-flow',   4, '08:00'),
  ('reformer-alapok', 4, '18:00'),
  ('reformer-sculpt', 5, '09:00'),
  ('reformer-flow',   5, '17:00')
) AS v(slug, dow, t)
JOIN class_types ct ON ct.slug = v.slug
CROSS JOIN (SELECT id FROM instructors WHERE email = 'anna@nagomipilates.hu') i;

-- Eszter orai
INSERT INTO scheduled_classes (class_type_id, instructor_id, day_of_week, start_time)
SELECT ct.id, i.id, dow, t::TIME
FROM (VALUES
  ('reformer-flow',   1, '10:30'),
  ('reformer-sculpt', 1, '19:00'),
  ('reformer-alapok', 2, '10:00'),
  ('reformer-sculpt', 3, '10:30'),
  ('reformer-flow',   3, '19:00'),
  ('reformer-alapok', 4, '10:00'),
  ('reformer-sculpt', 4, '19:00'),
  ('reformer-flow',   5, '10:30'),
  ('reformer-alapok', 5, '18:30')
) AS v(slug, dow, t)
JOIN class_types ct ON ct.slug = v.slug
CROSS JOIN (SELECT id FROM instructors WHERE email = 'eszter@nagomipilates.hu') i;

-- Szombati orak (Anna)
INSERT INTO scheduled_classes (class_type_id, instructor_id, day_of_week, start_time)
SELECT ct.id, i.id, 6, t::TIME
FROM (VALUES
  ('reformer-alapok', '09:00'),
  ('reformer-flow',   '10:30')
) AS v(slug, t)
JOIN class_types ct ON ct.slug = v.slug
CROSS JOIN (SELECT id FROM instructors WHERE email = 'anna@nagomipilates.hu') i;
