/**
 * A hely közös adatai egy helyen. Minden érték env-ből felülírható,
 * az alapérték a kanonikus nagomi-pilates.hu domain.
 */

function clean(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export const SITE_NAME = "Nagomi Pilates Studio";

export const SITE_URL = (
  clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://nagomi-pilates.hu"
).replace(/\/+$/, "");

export const CONTACT_EMAIL =
  clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "talk@nagomi-pilates.hu";

export const FROM_EMAIL = `${SITE_NAME} <${
  clean(process.env.EMAIL_FROM_ADDRESS) ?? "foglalas@nagomi-pilates.hu"
}>`;

export const ADMIN_NOTIFY_EMAIL =
  clean(process.env.ADMIN_EMAIL) ?? CONTACT_EMAIL;

export const PHONE = clean(process.env.NEXT_PUBLIC_PHONE) ?? "+36 30 411 4071";

/** tel: hivatkozáshoz: csak számjegyek és a vezető + */
export const PHONE_HREF = `tel:${PHONE.replace(/[^\d+]/g, "")}`;

export const ADDRESS =
  clean(process.env.NEXT_PUBLIC_ADDRESS) ??
  "Debrecen-Józsa, Deák Ferenc utca 2.";

/** Az indexelés csak a NEXT_PUBLIC_INDEXING=on érték mellett engedélyezett. */
export const INDEXING_ENABLED = process.env.NEXT_PUBLIC_INDEXING === "on";

/** GA4 mérési azonosító (G-XXXX); ha üres, nincs mérés és nincs süti-sáv sem. */
export const GA_ID = clean(process.env.NEXT_PUBLIC_GA_ID);
