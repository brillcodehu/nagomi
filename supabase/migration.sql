-- ============================================================
-- NAGOMI PILATES - FOGLALASI RENDSZER
-- Teljes adatbazis schema, seed data
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
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT,
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

-- Vasarolt berletek
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
-- SEED DATA
-- ============================================================

-- Oratipusok
INSERT INTO class_types (name, slug, description, tagline, duration_min, max_capacity, price_huf, difficulty, is_private, sort_order) VALUES
  ('Reformer Alapok', 'reformer-alapok',
   'Ismerkedj meg a reformer geppel es a pilates alapelveivel. Oktatonk lepesrol lepesre vezet vegig az alapgyakorlatokon, figyelembe veve a tested egyedi adottsagait.',
   'A testerzekeles elso lepesei', 50, 6, 4500, 1, false, 1),
  ('Reformer Flow', 'reformer-flow',
   'A studio zaszloshajo oraja. Folyamatos, aramlo mozdulatsorok a reformer gepen, amik egyszerre formaljak a tested es nyugtatjak az elmed.',
   'Ero es elegancia egyensulya', 55, 6, 5000, 2, false, 2),
  ('Reformer Sculpt', 'reformer-sculpt',
   'Intenzivebb ora magasabb ellenallassal es osszettebb gyakorlatokkal. Celzott izomcsoportokat dolgozunk meg a maximalis hatekonysagert.',
   'Formald a tested precizoval', 50, 6, 5000, 3, false, 3),
  ('Privat Ora', 'privat-ora',
   'Kizarolag rad szabott edzesterv, egy-az-egyben oktatoi figyelemmel. Idealis celzott problemak kezelesere vagy gyorsitott fejlodesre.',
   'Kizarolag rad szabva', 55, 1, 12000, 0, true, 4);

-- Berlet tipusok
INSERT INTO pass_types (name, occasions, price_huf, valid_days, description, sort_order) VALUES
  ('Proba alkalom', 1, 3500, 14,
   'Elso latogatashoz - kedvezmenyes probaora barmely csoportos foglalkozasra.', 1),
  ('5 alkalmas berlet', 5, 20000, 30,
   '5 alkalom, 30 napos ervenyesseg. Alkalmanként 4 000 Ft.', 2),
  ('10 alkalmas berlet', 10, 35000, 60,
   '10 alkalom, 60 napos ervenyesseg. Alkalmanként 3 500 Ft - a legjobb ar!', 3);

-- Oktatok (password_hash: a bcryptjs-sel hashelt jelszot kell ide irni)
-- Peldaul: npx bcryptjs hash "admin123" -> $2a$10$...
INSERT INTO instructors (name, email, bio) VALUES
  ('Kovacs Anna', 'anna@nagomipilates.hu',
   'Certified Pilates oktato, 8 eves tapasztalattal. Specialitasa a rehabilitacios pilates es a kezdok oktatasa.'),
  ('Nagy Eszter', 'eszter@nagomipilates.hu',
   'STOTT Pilates minositésu oktato. Mozgasterapias hatterrel, az intenziv es flow orak szakertoje.');

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
