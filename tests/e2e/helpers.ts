import { readFileSync, existsSync, writeFileSync } from "node:fs";
import postgres from "postgres";
import Stripe from "stripe";
import type { APIRequestContext, Page } from "@playwright/test";
import { E2E_ENV } from "./env";

export const ADMIN_EMAIL = "antonia@nagomi-pilates.hu";
export const ADMIN_PASSWORD = E2E_ENV.SEED_ADMIN_PASSWORD;

export function sql() {
  return postgres(E2E_ENV.DATABASE_URL, { max: 1 });
}

/** A következő hét hétfője (UTC), YYYY-MM-DD. Mindig jövőbeli, így nem "múlt" óra. */
export function nextMonday(offsetWeeks = 1): string {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff + 7 * offsetWeeks);
  return d.toISOString().slice(0, 10);
}

let counter = 0;
export function uid(prefix: string) {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}${Math.random().toString(36).slice(2, 6)}`;
}

const stripe = new Stripe("sk_test_mock");

/** Aláírt Stripe webhook-esemény küldése az alkalmazásnak. */
export async function postWebhook(
  request: APIRequestContext,
  type: string,
  object: Record<string, unknown>,
  opts: { secret?: string; eventId?: string } = {}
) {
  const payload = JSON.stringify({
    id: opts.eventId ?? uid("evt"),
    object: "event",
    type,
    data: { object },
  });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: opts.secret ?? E2E_ENV.STRIPE_WEBHOOK_SECRET,
  });
  return request.post("/api/stripe/webhook", {
    data: payload,
    headers: { "content-type": "application/json", "stripe-signature": signature },
  });
}

export type MailEntry = { at: string; from: string; to: string; subject: string; html: string };

export function readMails(): MailEntry[] {
  const file = E2E_ENV.EMAIL_LOG_FILE;
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as MailEntry);
}

export function resetMailLog() {
  writeFileSync(E2E_ENV.EMAIL_LOG_FILE, "");
}

/** A süti-sáv döntését előre beállítja, hogy ne takarja a felületet. */
export async function dismissConsent(page: Page, choice: "granted" | "denied" = "denied") {
  await page.addInitScript((c) => {
    try {
      window.localStorage.setItem("nagomi-consent", c);
    } catch {}
    // A GA letöltése a próbában ne menjen ki a hálózatra.
  }, choice);
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
}

/** Egy óra azonosítója az adatbázisból (óratípus slug + időpont alapján). */
export async function findScheduledClass(slug: string, startTime: string, dow: number) {
  const db = sql();
  try {
    const rows = await db`
      select sc.id from scheduled_classes sc
      join class_types ct on ct.id = sc.class_type_id
      where ct.slug = ${slug} and sc.start_time = ${startTime + ":00"} and sc.day_of_week = ${dow}
      limit 1`;
    return rows[0]?.id as string;
  } finally {
    await db.end();
  }
}

export function dateOfWeekday(monday: string, dow: number): string {
  const d = new Date(monday + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + dow - 1);
  return d.toISOString().slice(0, 10);
}
