import { execFileSync } from "node:child_process";
import { test, expect } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD, dismissConsent } from "./helpers";

test.describe("SEO és jogi oldalak", () => {
  test("robots.txt alapból mindent tilt, a sitemap 200 és nem tartalmazza a foglalás oldalait", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Disallow: /");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const p of ["/impresszum", "/adatkezeles", "/suti"]) expect(xml).toContain(p);
    expect(xml).not.toContain("/foglalas/sikeres");
    expect(xml).not.toContain("/admin");
  });

  test("a főoldal noindex, amíg az indexelés nincs bekapcsolva", async ({ page }) => {
    await dismissConsent(page);
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^http:\/\/127\.0\.0\.1:3539\/?$/);
  });

  test("NEXT_PUBLIC_INDEXING=on esetén a robots az admint és az API-t tiltja, és hivatkozik a sitemapre", async () => {
    // a site.ts modul-szinten olvassa az env-et, ezért külön folyamatban futtatjuk
    const out = execFileSync(
      process.execPath,
      [
        "node_modules/tsx/dist/cli.mjs",
        "-e",
        'import robots from "./src/app/robots"; console.log(JSON.stringify(robots()));',
      ],
      { env: { ...process.env, NEXT_PUBLIC_INDEXING: "on", NEXT_PUBLIC_SITE_URL: "https://nagomi-pilates.hu" }, encoding: "utf8" }
    );
    const result = JSON.parse(out.trim().split("\n").pop()!);
    expect(result.rules).toEqual([{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }]);
    expect(result.sitemap).toBe("https://nagomi-pilates.hu/sitemap.xml");
  });

  for (const path of ["/impresszum", "/adatkezeles", "/suti"]) {
    test(`${path} 200, és a lábléc hivatkozik rá`, async ({ page }) => {
      await dismissConsent(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.goto("/");
      await expect(page.getByRole("navigation", { name: "Jogi tájékoztatók" }).locator(`a[href="${path}"]`)).toHaveCount(1);
    });
  }

  test("a hiányzó cégadat látható megadandó jelzést kap, az admin által kitöltött adat megjelenik", async ({ page }) => {
    await dismissConsent(page);
    await page.goto("/impresszum");
    await expect(page.locator('[data-missing="true"]').first()).toHaveText("megadandó");
    expect(await page.locator('[data-missing="true"]').count()).toBeGreaterThanOrEqual(4);

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Jelszo").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Bejelentkezes" }).click();
    await page.waitForURL("**/admin");
    await page.goto("/admin/settings");
    await page.getByLabel(/Üzemeltető neve/).fill("Próba Üzemeltető Kft.");
    await page.getByRole("button", { name: "Mentés" }).click();
    await expect(page.getByRole("status")).toContainText("Elmentve");

    await page.goto("/impresszum");
    await expect(page.getByText("Próba Üzemeltető Kft.")).toBeVisible();
    // a többi mező továbbra is megadandó, nem kitalált érték
    expect(await page.locator('[data-missing="true"]').count()).toBeGreaterThanOrEqual(3);
  });

  test("süti-sáv: döntés előtt nincs mérés, az elfogadás után a döntés megmarad", async ({ page }) => {
    await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: "Süti-beállítások" });
    await expect(dialog).toBeVisible();
    const consentDefault = await page.evaluate(() =>
      (window.dataLayer as unknown[][]).find((e) => e[0] === "consent" && e[1] === "default")
    );
    expect(JSON.stringify(consentDefault)).toContain('"analytics_storage":"denied"');

    await dialog.getByRole("button", { name: "Elfogadom" }).click();
    await expect(dialog).toBeHidden();
    const update = await page.evaluate(() =>
      (window.dataLayer as unknown[][]).find((e) => e[0] === "consent" && e[1] === "update")
    );
    expect(JSON.stringify(update)).toContain('"analytics_storage":"granted"');

    await page.reload();
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Süti-beállítások" }).first().click();
    await expect(dialog).toBeVisible();
  });
});
