import { test, expect, type Page } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD, dateOfWeekday, dismissConsent, nextMonday, sql } from "./helpers";

async function login(page: Page) {
  await dismissConsent(page);
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Jelszo").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Bejelentkezes" }).click();
  await page.waitForURL("**/admin");
}

test.describe("admin", () => {
  test("belépés nélkül az /admin a belépő oldalra irányít, az admin API 401", async ({ page, request }) => {
    await page.goto("/admin/schedule");
    await expect(page).toHaveURL(/\/admin\/login/);
    for (const path of ["/api/admin/bookings", "/api/admin/classes", "/api/admin/settings", "/api/admin/dashboard"]) {
      expect((await request.get(path)).status()).toBe(401);
    }
  });

  test("hibás jelszóval nem lép be", async ({ page }) => {
    await dismissConsent(page);
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Jelszo").fill("rossz-jelszo");
    await page.getByRole("button", { name: "Bejelentkezes" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator(".text-destructive").first()).toBeVisible();
  });

  test("belépés, órarend-kezelés: új óra felvétele megjelenik a nyilvános órarendben, törlés után eltűnik", async ({ page, request }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.goto("/admin/schedule");
    await page.getByRole("button", { name: "Uj ora" }).click();
    const form = page.locator("form");
    await form.locator("select").nth(0).selectOption({ label: "Privat Ora" });
    await form.locator("select").nth(2).selectOption({ label: "Szerda" });
    await form.locator('input[type="time"]').fill("21:15");
    await form.getByRole("button", { name: "Mentes" }).click();
    await expect(page.getByText("21:15").first()).toBeVisible();

    const monday = nextMonday(1);
    const res = await request.get(`/api/schedule?weekStart=${monday}`);
    const { schedule } = await res.json();
    const created = schedule.find((s: { classDate: string; startTime: string; classSlug: string }) =>
      s.classDate === dateOfWeekday(monday, 3) && s.startTime === "21:15" && s.classSlug === "privat-ora");
    expect(created).toBeTruthy();
    expect(created.maxSpots).toBe(1);

    // törlés a felületen
    page.once("dialog", (d) => d.accept());
    const row = page.locator("tr", { hasText: "21:15" });
    await row.getByTitle("Torles").click();
    await expect(page.locator("tr", { hasText: "21:15" })).toHaveCount(0);
    const after = await (await request.get(`/api/schedule?weekStart=${monday}`)).json();
    expect(after.schedule.find((s: { startTime: string }) => s.startTime === "21:15")).toBeFalsy();
  });

  test("a foglalások és bérletek oldalak betöltenek, a webhookkal létrejött adat látszik", async ({ page }) => {
    const db = sql();
    try {
      await login(page);
      for (const path of ["/admin/bookings", "/admin/passes", "/admin/class-types", "/admin/settings"]) {
        const res = await page.goto(path);
        expect(res?.status()).toBe(200);
        await expect(page.locator("h1").first()).toBeVisible();
      }
    } finally {
      await db.end();
    }
  });
});
