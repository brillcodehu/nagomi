# Élesítés és bekapcsolás: nagomi-pilates.hu

Állapot (2026-10-22): a kód készen áll, de az ügyfél-státusz, a Stripe, a Resend és a számlázó kulcsai ismeretlenek. Minden lépés az ügyfél-státusz tisztázása után következik. A sorrend számít.

## 0. Mit tud ma az élő oldal és mit nem

- Az élő oldal indexelhető volt (nem volt robots-jelzés). Az új kiadástól alapból `noindex` és `Disallow: /`, amíg a `NEXT_PUBLIC_INDEXING=on` be nincs állítva.
- A foglalás a kiadástól az adatbázis órarendjére és a Stripe-ra épül. Ha a Stripe kulcsa nincs beállítva, a bankkártyás foglalás hibaüzenetet ad (a függő foglalás lemondódik), a bérletes foglalás működik.
- Bérlet-vásárlás felület a nyilvános oldalon nincs (az API kész). Amíg ez nincs, a bérletet az admin adhatja ki, vagy a vásárlás a stúdióban történik.

## 1. Kiadás utáni adatbázis-lépés (egyszer)

A kiadás két új táblát (`settings`, `invoices`) és egy egyedi indexet (`customer_passes_unique_session`) hoz. A meglévő éles adatbázison ezeket a `/api/setup` útvonal hozza létre (`CREATE ... IF NOT EXISTS`, idempotens, a már feltöltött adatbázisba nem tölt újra adatot):

```bash
curl -s https://nagomi-pilates.hu/api/setup
# várt válasz: {"message":"Az adatbazis mar be van allitva."}
```

Kézi alternatíva (psql az éles adatbázison, ugyanaz a séma):

```sql
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '', updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, seq SERIAL NOT NULL,
  stripe_checkout_session_id TEXT NOT NULL, kind TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  customer_pass_id UUID REFERENCES customer_passes(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, description TEXT NOT NULL,
  amount_huf INT NOT NULL, provider TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'issued',
  invoice_number TEXT, provider_ref TEXT, error TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE UNIQUE INDEX IF NOT EXISTS invoices_unique_session_kind ON invoices(stripe_checkout_session_id, kind);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE UNIQUE INDEX IF NOT EXISTS customer_passes_unique_session ON customer_passes(stripe_checkout_session_id);
```

A `drizzle/` mappa (`npm run db:generate`) egy teljes alap-migrációt tartalmaz **új, üres** adatbázishoz. Az éles adatbázison nem futtatható (a táblák már léteznek).

Amíg a táblák nincsenek meg, az oldal nem dől el: a jogi oldalak "megadandó" jelzéseket mutatnak, a számlázás hibát naplóz és a webhook mégis lefut.

## 2. Jogi adatok (admin: Beállítások, Jogi adatok)

Az impresszum és az adatkezelési tájékoztató cégadatai az admin felületen szerkeszthetők. Amit az ügyfél nem adott meg, azt a lap "megadandó" jelzéssel mutatja, soha nem kitalált adat.

- Üzemeltető neve, székhely, adószám, cégjegyzék- vagy nyilvántartási szám, tárhelyszolgáltató.
- Az adatkezelési tájékoztató szövege sablon: éles indulás előtt az ügyfél jogásza vagy az adatvédelmi felelőse nézze át (megőrzési idők, adatfeldolgozók listája, a számlázó szolgáltató neve).

## 3. Resend (levelek)

1. A küldő domain (nagomi-pilates.hu) hitelesítése a Resend felületén: a megadott SPF, DKIM, DMARC rekordokat az ügyfél domain-szolgáltatójánál (rackhost.hu) kell felvenni. DNS-módosítás: az ügyfél vagy Tamás jóváhagyásával.
2. Env: `RESEND_API_KEY` (a kulcs a Coolify env-ben, nem a repóban), `EMAIL_FROM_ADDRESS=foglalas@nagomi-pilates.hu` (ha eltér az alaptól), `ADMIN_EMAIL` (az értesítések címzettje).
3. Próba: egy teszt-foglalás után a vendég és az admin levele megérkezik. Kulcs nélkül a levelek csak naplózódnak.

## 4. Stripe

1. A Stripe-fiók az ügyfélé; az éles kulcsokat az ügyfél adja át (Tamás másolja be, az ügynök nem).
2. Env: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`. A `STRIPE_API_*` változók maradjanak üresek (azok csak a helyi stripe-mockhoz kellenek).
3. Webhook-végpont a Stripe felületén: `https://nagomi-pilates.hu/api/stripe/webhook`, események: `checkout.session.completed`, `checkout.session.expired`. A kapott aláíró titok kerül a `STRIPE_WEBHOOK_SECRET`-be.
4. Először teszt-kulcsokkal (Stripe test mode) egy teljes kör: foglalás, fizetés a 4242 4242 4242 4242 teszt-kártyával, megerősítés, levél, számla (mock), lemondás és visszatérítés. Csak utána élesre.
5. Ellenőrzés után az éles kulcsra váltás, egy valódi, kis összegű fizetés és visszatérítés a stúdió tulajdonosával.

## 5. Számlázás

A számlázó adapter a `src/lib/invoicing/` alatt van. Alapérték: `INVOICE_PROVIDER=mock` (nem állít ki valódi számlát, csak az `invoices` táblába naplóz MOCK- előtagú sorszámmal). Tilos éles fizetéssel mock mellett indulni: a vevő nem kapna számlát.

Számlázz.hu bekapcsolása (az ügyfél számlázási döntése után):

1. Az ügyfél Számlázz.hu fiókjában Számla Agent kulcs, e-számla beállítás.
2. Env: `INVOICE_PROVIDER=szamlazz`, `SZAMLAZZ_AGENT_KEY`, `SZAMLAZZ_VAT` (alap `AAM`; az ügyfél könyvelője mondja meg: alanyi adómentes vagy 27%), `SZAMLAZZ_ESZAMLA` (`true` alap).
3. A `szamlazz.ts` egy **váz**: éles kulccsal még nem futott. Az első számlát Számlázz.hu próbafiókon (vagy tesztkulccsal) kell kipróbálni, és az XML mezőit (vevő címe, számlatömb, megjegyzés) a fiók beállításaihoz igazítani. A vevő címe jelenleg nem kerül a számlára, mert a foglalás nem kér számlázási címet: ha az ügyfél könyvelője kéri, a foglalási űrlapot bővíteni kell.
4. Hibás kiállítást a `invoices` tábla mutatja: `select * from invoices where status = 'failed'`. A hibás számla ugyanarra a Stripe-eseményre (webhook újraküldés a Stripe felületéről) újra kiállítható.
5. Lemondáskor a visszatérített bankkártyás foglalás számlája sztornózódik (`status = 'stornoed'`).

## 6. Indexelés bekapcsolása

Csak akkor, ha a foglalás és a számlázás élesben is működik, és az ügyfél jóváhagyta.

1. Coolify env (build-változóként is): `NEXT_PUBLIC_INDEXING=on`. Ha a mérés is kell: `NEXT_PUBLIC_GA_ID=G-...`.
2. Újra-build (a `NEXT_PUBLIC_*` értékek build-időben épülnek be).
3. Ellenőrzés: `curl -s https://nagomi-pilates.hu/robots.txt` (Allow, Disallow: /admin, /api/, Sitemap sor), a főoldal HTML-jében nincs `noindex`.
4. A `sitemap.xml` beküldése a Google Search Console-ban.

## 7. Esettanulmány a brillcode.hu-n

A nagomi-pilates esettanulmány a brillcode repóban rejtett (`lib/portfolio/content.ts`, REJTETT lista). A levétel Tamás döntése, amikor a foglalás és a számlázás élesben is bizonyítottan működik.

## 8. Élesítés utáni ellenőrzés

```bash
curl -s https://nagomi-pilates.hu/robots.txt
curl -sI https://nagomi-pilates.hu/sitemap.xml | head -1
for p in / /impresszum /adatkezeles /suti /foglalas/sikeres; do curl -s -o /dev/null -w "$p %{http_code}\n" https://nagomi-pilates.hu$p; done
curl -s "https://nagomi-pilates.hu/api/schedule?weekStart=$(date -d 'next monday' +%F)" | head -c 200
```

Az admin belépés után: Beállítások, Jogi adatok kitöltve; Foglalások oldal; egy próba-foglalás a teljes körön.
