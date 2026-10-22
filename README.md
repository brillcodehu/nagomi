# Nagomi Pilates Studio

A nagomi-pilates.hu weboldala és foglalási rendszere (Debrecen-Józsa, Deák Ferenc utca 2.): reformer pilates órarend, óra-foglalás bankkártyával vagy bérlettel, bérlet-vásárlás, admin felület az oktatónak. Üzemeltető: BrillCode.

## Mit tud

- Nyilvános főoldal: bemutatkozás, óratípusok, **heti órarend az adatbázisból** (szűrés óratípusra, hétváltás), árak, helyszín.
- Foglalás: óra kiválasztása, adatok megadása, majd fizetés bankkártyával (Stripe Checkout) vagy meglévő bérlettel (e-mail-cím alapján ellenőrizve).
- Webhook (`/api/stripe/webhook`): a fizetés után megerősíti a foglalást, aktiválja a megvásárolt bérletet, leveleket küld (Resend), számlát állít ki (számlázó adapter). Az ismételt webhook nem duplikál.
- Lemondás (`/api/bookings/cancel`): bankkártyás foglalásnál visszatérítés és számla-sztornó, bérletes foglalásnál az alkalom visszajár.
- Admin (`/admin`): órarend, óratípusok, bérlettípusok, foglalások, bérletek, jogi adatok (impresszum, adatkezelés). Belépés oktatói fiókkal, a `src/proxy.ts` védi.
- SEO és jogi réteg: `robots.txt`, `sitemap.xml`, `/impresszum`, `/adatkezeles`, `/suti`, süti-sáv és Consent Mode a GA4-hez. Az indexelés alapból tiltott.

Ismert hiány: a nyilvános oldalon bérlet-vásárlási felület még nincs (az API kész: `/api/passes`), a bérlet-árak a főoldalon statikus szövegek.

## Stack

Next.js 16 (App Router, módosított kiadás: lásd `AGENTS.md`), React 19, Tailwind CSS 4, Drizzle ORM + PostgreSQL, NextAuth (Auth.js v5, credentials), Stripe, Resend, GSAP, Lenis.

## Környezeti változók

Az értékeket soha nem kell a repóba tenni, a nevek a `.env.example` fájlban vannak:

| Név | Mire |
|---|---|
| `DATABASE_URL` | PostgreSQL kapcsolat |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | belépés (admin) |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | fizetés |
| `STRIPE_API_HOST`, `STRIPE_API_PORT`, `STRIPE_API_PROTOCOL` | csak helyi próbához: stripe-mock; üresen az éles Stripe |
| `RESEND_API_KEY` | levélküldés; nélküle a levelek a konzolra (és az `EMAIL_LOG_FILE` fájlba) kerülnek, nem mennek ki |
| `ADMIN_EMAIL` | az admin értesítések címe |
| `NEXT_PUBLIC_SITE_URL` | a kanonikus cím (alap: https://nagomi-pilates.hu) |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_ADDRESS`, `EMAIL_FROM_ADDRESS` | webhelyadatok felülírása (`src/lib/site.ts`) |
| `NEXT_PUBLIC_INDEXING` | `on` esetén indexelhető; egyébként `noindex` és `Disallow: /` |
| `NEXT_PUBLIC_GA_ID` | GA4 mérési azonosító; üresen nincs mérés és nincs süti-sáv |
| `INVOICE_PROVIDER`, `SZAMLAZZ_AGENT_KEY`, `SZAMLAZZ_VAT`, `SZAMLAZZ_ESZAMLA` | számlázás: `mock` (alap) vagy `szamlazz` |

A `NEXT_PUBLIC_*` értékek build-időben épülnek be: módosításuk után újra kell építeni.

## Fejlesztés

```bash
npm install
cp .env.example .env.local        # és töltsd ki helyi értékekkel
npm run db:push                   # séma a helyi adatbázisba (drizzle-kit)
npm run seed                      # mintaadatok (csak helyi adatbázisra fut)
npm run dev
```

Az adatbázis-séma a `src/lib/db/schema.ts` fájlban van. Az éles adatbázis táblait a `/api/setup` útvonal hozza létre (`CREATE TABLE IF NOT EXISTS`, idempotens), lásd `docs/ELESITES.md`.

## Build és indítás

```bash
npm run build
npm run start
```

## Tesztek (E2E, mock szolgáltatókkal)

A csomag a `tests/e2e/` alatt van (Playwright), a foglalás - fizetés - levél - számla láncot és az admin felületet fedi, éles kulcs és éles adatbázis nélkül.

```bash
docker run -d --name nagomi-dev-pg -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=nagomi -p 127.0.0.1:55482:5432 postgres:17-alpine
docker run -d --name nagomi-stripe-mock -p 127.0.0.1:12182:12111 stripe/stripe-mock:v0.197.0
DATABASE_URL=postgresql://postgres:dev@127.0.0.1:55482/nagomi npm run db:push
DATABASE_URL=postgresql://postgres:dev@127.0.0.1:55482/nagomi npm run seed
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3539 NEXT_PUBLIC_GA_ID=G-E2ETEST000 npm run build
npx playwright test
```

A stripe-mock `v0.197.0` verziót használd: a `latest` (0.206) elutasítja a `payment_method_types` mezőt. A próbák a `globalSetup`-ban törlik a foglalásokat, bérleteket és számlákat, ezért csak a helyi adatbázison futnak (a csomag más hostot megtagad). A mobil képernyőképek a `tests/e2e/.screenshots/` mappába készülnek.

## Üzemeltetés

Coolify, Nixpacks build, Nagomi-Pilates alkalmazás. Az élesítési és bekapcsolási lépések: `docs/ELESITES.md`.
