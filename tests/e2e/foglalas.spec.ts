import { test, expect, type Page } from "@playwright/test";
import {
  dateOfWeekday,
  dismissConsent,
  findScheduledClass,
  nextMonday,
  postWebhook,
  readMails,
  resetMailLog,
  sql,
  uid,
} from "./helpers";

/**
 * A foglalás - fizetés - levél - számla lánc, mock Stripe-pal.
 * A Stripe Checkout oldalát nem nyitjuk meg: a böngésző a mock által adott
 * checkout.stripe.com címre irányul (a hálózati kérést elfogjuk), a fizetés
 * megtörténtét aláírt webhook-eseménnyel jelezzük, mint az éles Stripe tenné.
 */

const MONDAY = nextMonday(1);

async function gotoNextWeek(page: Page) {
  await dismissConsent(page);
  await page.goto("/");
  await page.locator("#idopontok").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Következő hét" }).click();
  await expect(page.getByText("Az órarend betöltése...")).toBeHidden();
}

async function fillCustomer(page: Page, name: string, email: string, phone: string) {
  await page.getByLabel("Név", { exact: true }).fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Telefonszám").fill(phone);
}

test.describe.configure({ mode: "serial" });

test.beforeEach(() => resetMailLog());

test("órarend: a heti órák az adatbázisból jönnek, a szűrő működik", async ({ page }) => {
  await gotoNextWeek(page);
  const cards = page.getByRole("button", { name: /Reformer .* - \d\d:\d\d, Antonia/ });
  expect(await cards.count()).toBeGreaterThan(5);
  // a régi mintaadat oktatói nem jelenhetnek meg
  await expect(page.getByText("Kovács Anna")).toHaveCount(0);

  await page.getByRole("button", { name: "Reformer Flow", exact: true }).first().click();
  const flow = page.getByRole("button", { name: /Reformer Flow - \d\d:\d\d, Antonia/ });
  expect(await flow.count()).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: /Reformer Sculpt - \d\d:\d\d/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Reformer Alapok - \d\d:\d\d/ })).toHaveCount(0);
});

test("foglalás bérlet nélkül: bankkártyás fizetés a mock Stripe-ig, majd a webhook megerősíti", async ({ page, request }) => {
  const email = `kartya-${Date.now()}@example.com`;
  await gotoNextWeek(page);

  // Hétfő 09:00 Reformer Alapok a következő héten
  await page.getByRole("button", { name: "Reformer Alapok - 09:00, Antonia" }).first().click();
  const modal = page.getByRole("dialog", { name: "Foglalás: Reformer Alapok" });
  await expect(modal).toBeVisible();
  await modal.getByRole("button", { name: "Tovább" }).click();
  await fillCustomer(page, "Kártyás Kata", email, "+36 30 111 2233");
  await modal.getByRole("button", { name: "Tovább" }).click();
  await expect(modal.getByText("Fizetési mód")).toBeVisible();

  await page.route("https://checkout.stripe.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Stripe Checkout (mock)</h1>" })
  );
  await Promise.all([
    page.waitForURL(/checkout\.stripe\.com\/pay\//),
    modal.getByRole("button", { name: "Fizetés bankkártyával" }).click(),
  ]);

  const db = sql();
  try {
    const [booking] = await db`select * from bookings where customer_email = ${email}`;
    expect(booking.status).toBe("pending");
    expect(String(booking.class_date.toISOString?.().slice(0, 10) ?? booking.class_date)).toBe(MONDAY);
    expect(booking.payment_type).toBe("stripe");
    expect(booking.amount_huf).toBe(4500);
    expect(booking.stripe_checkout_session_id).toMatch(/^cs_test_/);
    expect(readMails()).toHaveLength(0); // fizetés előtt nincs levél

    // A mock mindig ugyanazt a session-azonosítót adja, ezért a fizetést
    // saját, egyedi azonosítóval jelezzük vissza.
    const sessionId = uid("cs_test_kartya");
    const event = {
      id: sessionId,
      object: "checkout.session",
      payment_intent: "pi_test_kartya_1",
      metadata: { type: "class_booking", booking_id: booking.id },
    };
    const first = await postWebhook(request, "checkout.session.completed", event);
    expect(first.status()).toBe(200);

    const [confirmed] = await db`select status, stripe_payment_intent_id from bookings where id = ${booking.id}`;
    expect(confirmed.status).toBe("confirmed");
    expect(confirmed.stripe_payment_intent_id).toBe("pi_test_kartya_1");

    // levél: a vendégnek és az adminnak (RESEND_API_KEY nélkül naplózva)
    const mails = readMails();
    expect(mails.map((m) => m.to)).toContain(email);
    expect(mails).toHaveLength(2);
    expect(mails.find((m) => m.to === email)?.subject).toContain("Foglalas megerositese");
    expect(mails.find((m) => m.to === email)?.html).toContain("Kártyás Kata");

    // pontosan egy számla
    const invoices = await db`select * from invoices where booking_id = ${booking.id}`;
    expect(invoices).toHaveLength(1);
    expect(invoices[0].status).toBe("issued");
    expect(invoices[0].provider).toBe("mock");
    expect(invoices[0].amount_huf).toBe(4500);
    expect(invoices[0].invoice_number).toMatch(/^MOCK-\d{4}-\d{6}$/);

    // ismételt webhook: nincs második levél, nincs második számla, egy foglalás
    const second = await postWebhook(request, "checkout.session.completed", event);
    expect(second.status()).toBe(200);
    expect(readMails()).toHaveLength(2);
    expect(await db`select id from invoices where stripe_checkout_session_id = ${sessionId}`).toHaveLength(1);
    expect(await db`select id from bookings where customer_email = ${email}`).toHaveLength(1);
  } finally {
    await db.end();
  }
});

test("lemondás: visszatérítés a mock Stripe-on, a számla sztornózva", async ({ request }) => {
  const sc = await findScheduledClass("reformer-flow", "10:30", 1);
  const date = dateOfWeekday(MONDAY, 1);
  const email = `lemondas-${Date.now()}@example.com`;
  const db = sql();
  try {
    const [b] = await db`
      insert into bookings (scheduled_class_id, class_date, customer_name, customer_email, customer_phone, status, payment_type, amount_huf, stripe_checkout_session_id)
      values (${sc}, ${date}, 'Lemondó Laci', ${email}, '+36301112233', 'pending', 'stripe', 5000, 'cs_test_x') returning id`;
    const event = {
      id: uid("cs_test_lemondas"),
      object: "checkout.session",
      payment_intent: "pi_test_lemondas",
      metadata: { type: "class_booking", booking_id: b.id },
    };
    expect((await postWebhook(request, "checkout.session.completed", event)).status()).toBe(200);
    expect(await db`select id from invoices where booking_id = ${b.id} and status = 'issued'`).toHaveLength(1);

    const res = await request.post("/api/bookings/cancel", { data: { bookingId: b.id, reason: "E2E" } });
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);

    const [after] = await db`select status, cancellation_reason from bookings where id = ${b.id}`;
    expect(after.status).toBe("cancelled");
    expect(after.cancellation_reason).toBe("E2E");
    const [inv] = await db`select status from invoices where booking_id = ${b.id}`;
    expect(inv.status).toBe("stornoed");

    // kétszer nem mondható le
    const again = await request.post("/api/bookings/cancel", { data: { bookingId: b.id } });
    expect(again.status()).toBe(400);
  } finally {
    await db.end();
  }
});

test("bérlet: vásárlás webhookkal, foglalás a bérlettel (alkalom-levonás), lemondáskor visszajár", async ({ page, request }) => {
  const email = `berlet-${Date.now()}@example.com`;
  const db = sql();
  try {
    const [pt] = await db`select id, occasions, price_huf from pass_types where occasions = 5 limit 1`;
    const sessionId = uid("cs_test_berlet");
    const event = {
      id: sessionId,
      object: "checkout.session",
      payment_intent: "pi_test_berlet",
      metadata: {
        type: "pass_purchase",
        pass_type_id: pt.id,
        customer_name: "Bérletes Bea",
        customer_email: email,
        customer_phone: "+36301112233",
      },
    };
    expect((await postWebhook(request, "checkout.session.completed", event)).status()).toBe(200);
    // ismételt webhook: még mindig egy bérlet és egy számla
    expect((await postWebhook(request, "checkout.session.completed", event)).status()).toBe(200);
    expect(await db`select id from customer_passes where customer_email = ${email}`).toHaveLength(1);
    const invoices = await db`select * from invoices where stripe_checkout_session_id = ${sessionId}`;
    expect(invoices).toHaveLength(1);
    expect(invoices[0].kind).toBe("pass_purchase");
    expect(invoices[0].amount_huf).toBe(pt.price_huf);
    expect(readMails().filter((m) => m.to === email)).toHaveLength(1);

    // a /api/passes/check látja a bérletet
    const check = await request.post("/api/passes/check", { data: { email } });
    const { passes } = await check.json();
    expect(passes).toHaveLength(1);
    expect(passes[0].remainingOccasions).toBe(5);

    // foglalás a bérlettel a felületen
    await gotoNextWeek(page);
    await page.getByRole("button", { name: "Reformer Sculpt - 19:00, Antonia" }).first().click();
    const modal = page.getByRole("dialog", { name: "Foglalás: Reformer Sculpt" });
    await modal.getByRole("button", { name: "Tovább" }).click();
    await fillCustomer(page, "Bérletes Bea", email, "+36 30 111 2233");
    await modal.getByRole("button", { name: "Van bérletem" }).click();
    await modal.getByRole("button", { name: "Tovább" }).click();
    await modal.getByRole("button", { name: "Fizetés bérletbol" }).click();
    await expect(modal.getByText("Foglalásod megerosítve!")).toBeVisible();

    const [booking] = await db`select id, status, payment_type, pass_id, amount_huf from bookings where customer_email = ${email}`;
    expect(booking.status).toBe("confirmed");
    expect(booking.payment_type).toBe("pass");
    expect(booking.amount_huf).toBeNull();
    const [pass] = await db`select remaining_occasions from customer_passes where customer_email = ${email}`;
    expect(pass.remaining_occasions).toBe(4);
    // bérletes foglalásról nincs új számla (a bérlet vásárlásakor volt)
    expect(await db`select id from invoices where booking_id = ${booking.id}`).toHaveLength(0);
    expect(readMails().filter((m) => m.to === email && m.subject.includes("Foglalas megerositese"))).toHaveLength(1);

    // ugyanarra az órára másodszor nem foglalhat
    const dup = await request.post("/api/bookings", {
      data: {
        scheduledClassId: (await db`select scheduled_class_id from bookings where id = ${booking.id}`)[0].scheduled_class_id,
        classDate: (await db`select class_date::text from bookings where id = ${booking.id}`)[0].class_date,
        customerName: "Bérletes Bea",
        customerEmail: email,
        customerPhone: "+36301112233",
        paymentType: "pass",
        passId: passes[0].id,
      },
    });
    expect(dup.status()).toBe(409);
    expect((await dup.json()).error).toBe("DUPLICATE_BOOKING");

    // lemondás: az alkalom visszajár
    const cancel = await request.post("/api/bookings/cancel", { data: { bookingId: booking.id } });
    expect(cancel.status()).toBe(200);
    const [pass2] = await db`select remaining_occasions from customer_passes where customer_email = ${email}`;
    expect(pass2.remaining_occasions).toBe(5);
  } finally {
    await db.end();
  }
});

test("bérletes foglalás ismeretlen e-mail-címmel: érthető hibaüzenet, nincs foglalás", async ({ page }) => {
  const email = `nincs-berlet-${Date.now()}@example.com`;
  await gotoNextWeek(page);
  await page.getByRole("button", { name: "Reformer Alapok - 09:00, Antonia" }).first().click();
  const modal = page.getByRole("dialog", { name: "Foglalás: Reformer Alapok" });
  await modal.getByRole("button", { name: "Tovább" }).click();
  await fillCustomer(page, "Nincs Bérlet", email, "+36 30 111 2233");
  await modal.getByRole("button", { name: "Van bérletem" }).click();
  await modal.getByRole("button", { name: "Tovább" }).click();
  await modal.getByRole("button", { name: "Fizetés bérletbol" }).click();
  await expect(modal.getByRole("alert")).toContainText("nincs érvényes bérlet");
  const db = sql();
  try {
    expect(await db`select id from bookings where customer_email = ${email}`).toHaveLength(0);
  } finally {
    await db.end();
  }
});

test("a kártyás foglalás űrlap validál, hibás adatnál nem lép tovább", async ({ page }) => {
  await gotoNextWeek(page);
  await page.getByRole("button", { name: "Reformer Alapok - 09:00, Antonia" }).first().click();
  const modal = page.getByRole("dialog", { name: "Foglalás: Reformer Alapok" });
  await modal.getByRole("button", { name: "Tovább" }).click();
  await fillCustomer(page, "A", "nem-email", "12");
  await modal.getByRole("button", { name: "Tovább" }).click();
  await expect(modal.getByText("Kérjük, add meg a neved")).toBeVisible();
  await expect(modal.getByText("érvényes email címet")).toBeVisible();
  await expect(modal.getByText("érvényes telefonszámot")).toBeVisible();
  await expect(modal.getByText("Fizetési mód")).toHaveCount(0);
});

test("betelt óra: a szerver CLASS_FULL hibát ad", async ({ request }) => {
  const db = sql();
  try {
    // 1 férőhelyes óra: a privát óra az órarendben nincs, ezért létrehozzuk
    const [ct] = await db`select id from class_types where slug = 'privat-ora'`;
    const [inst] = await db`select id from instructors where email = 'antonia@nagomi-pilates.hu'`;
    const [created] = await db`
      insert into scheduled_classes (class_type_id, instructor_id, specific_date, start_time, notes)
      values (${ct.id}, ${inst.id}, ${dateOfWeekday(MONDAY, 3)}, '20:00:00', 'e2e-betelt') returning id`;
    const body = (email: string) => ({
      scheduledClassId: created.id,
      classDate: dateOfWeekday(MONDAY, 3),
      customerName: "Tele Tamás",
      customerEmail: email,
      customerPhone: "+36301112233",
      paymentType: "stripe",
    });
    const first = await request.post("/api/bookings", { data: body("elso@example.com") });
    expect(first.status()).toBe(200);
    const second = await request.post("/api/bookings", { data: body("masodik@example.com") });
    expect(second.status()).toBe(409);
    expect((await second.json()).error).toBe("CLASS_FULL");
    await db`delete from scheduled_classes where id = ${created.id}`;
  } finally {
    await db.end();
  }
});

test("webhook: aláírás nélkül és hibás aláírással 400", async ({ request }) => {
  const noSig = await request.post("/api/stripe/webhook", { data: "{}", headers: { "content-type": "application/json" } });
  expect(noSig.status()).toBe(400);
  const bad = await postWebhook(request, "checkout.session.completed", { id: "cs_x", metadata: {} }, { secret: "whsec_rossz" });
  expect(bad.status()).toBe(400);
});

test("lejárt fizetési oldal: a függő foglalás lemondódik, a hely felszabadul", async ({ request }) => {
  const sc = await findScheduledClass("reformer-flow", "17:30", 1);
  const date = dateOfWeekday(MONDAY, 1);
  const db = sql();
  try {
    const [b] = await db`
      insert into bookings (scheduled_class_id, class_date, customer_name, customer_email, customer_phone, status, payment_type, amount_huf)
      values (${sc}, ${date}, 'Lejárt Lili', 'lejart@example.com', '+36301112233', 'pending', 'stripe', 5000) returning id`;
    const res = await postWebhook(request, "checkout.session.expired", {
      id: uid("cs_test_lejart"),
      metadata: { type: "class_booking", booking_id: b.id },
    });
    expect(res.status()).toBe(200);
    const [after] = await db`select status from bookings where id = ${b.id}`;
    expect(after.status).toBe("cancelled");
  } finally {
    await db.end();
  }
});

test("e-mail naplózás RESEND_API_KEY nélkül: a küldés nem bukik el, a napló tartalmazza a levelet", async ({ request }) => {
  // az előző tesztek már bizonyították; itt a naplófájl szerkezetét ellenőrizzük egy friss levélen
  const email = `naplo-${Date.now()}@example.com`;
  const db = sql();
  try {
    const [pt] = await db`select id from pass_types limit 1`;
    const res = await postWebhook(request, "checkout.session.completed", {
      id: uid("cs_test_naplo"),
      payment_intent: "pi_test_naplo",
      metadata: { type: "pass_purchase", pass_type_id: pt.id, customer_name: "Napló <b>Nóra</b>", customer_email: email, customer_phone: "+36301112233" },
    });
    expect(res.status()).toBe(200);
    const mail = readMails().find((m) => m.to === email);
    expect(mail).toBeTruthy();
    expect(mail!.from).toContain("nagomi-pilates.hu");
    // a felhasználói szöveg HTML-escape-elve kerül a levélbe
    expect(mail!.html).not.toContain("<b>Nóra</b>");
    expect(mail!.html).toContain("&lt;b&gt;Nóra&lt;/b&gt;");
  } finally {
    await db.end();
  }
});
