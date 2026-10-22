import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { dismissConsent } from "./helpers";

/** axe-core (WCAG 2.1 A/AA): súlyos és kritikus hiba nem lehet. */
const PAGES = ["/", "/foglalas/sikeres?session_id=cs_test_x", "/foglalas/megszakitva", "/impresszum", "/adatkezeles", "/suti", "/admin/login"];

for (const path of PAGES) {
  test(`axe: ${path}`, async ({ page }) => {
    await dismissConsent(page);
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    if (serious.length) {
      console.log(path, JSON.stringify(serious.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) })), null, 1));
    }
    const minor = results.violations.filter((v) => !serious.includes(v));
    if (minor.length) console.log(path, "kisebb:", minor.map((v) => `${v.id}(${v.nodes.length})`).join(", "));
    expect(serious, `${path}: ${serious.map((v) => v.id).join(", ")}`).toEqual([]);
  });
}

test("axe: a foglalási ablak minden lépése", async ({ page }) => {
  await dismissConsent(page);
  await page.goto("/");
  await page.locator("#idopontok").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Következő hét" }).click();
  await page.getByRole("button", { name: /Reformer Alapok - 09:00, Antonia/ }).first().click();
  const modal = page.getByRole("dialog", { name: /Foglalás:/ });
  const scan = async (label: string) => {
    const r = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    if (serious.length) console.log(label, JSON.stringify(serious.map((v) => ({ id: v.id, n: v.nodes.length, t: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) }))));
    return serious;
  };
  const s0 = await scan("lépés 0");
  await modal.getByRole("button", { name: "Tovább" }).click();
  const s1 = await scan("lépés 1");
  await page.getByLabel("Név", { exact: true }).fill("Axe Aladár");
  await page.getByLabel("Email").fill("axe@example.com");
  await page.getByLabel("Telefonszám").fill("+36 30 111 2233");
  await modal.getByRole("button", { name: "Tovább" }).click();
  const s2 = await scan("lépés 2");
  expect([...s0, ...s1, ...s2].map((v) => v.id)).toEqual([]);
});
