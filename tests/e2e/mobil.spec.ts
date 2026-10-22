import { test, expect } from "@playwright/test";
import { dismissConsent } from "./helpers";

const OUT = "tests/e2e/.screenshots";

for (const width of [390, 320]) {
  test.describe(`mobil ${width}`, () => {
    test.use({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });

    for (const path of ["/", "/impresszum", "/adatkezeles", "/suti", "/foglalas/sikeres?session_id=cs_test_x", "/admin/login"]) {
      test(`${path}: nincs vízszintes túlcsordulás, képernyőkép`, async ({ page }) => {
        await dismissConsent(page);
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
        const name = (path === "/" ? "fooldal" : path.replace(/[^a-z]+/gi, "_")).replace(/^_|_$/g, "");
        await page.screenshot({ path: `${OUT}/${width}-${name}.png`, fullPage: true });
      });
    }

    test("a foglalás ablak mobilon használható, a fizetés gombok elérhetők", async ({ page }) => {
      await dismissConsent(page);
      await page.goto("/");
      await page.locator("#idopontok").scrollIntoViewIfNeeded();
      await page.getByRole("button", { name: "Következő hét" }).click();
      // mobilon napfülek vannak: a hétfő az alapértelmezett, ha nincs "ma" a héten
      await page.getByRole("button", { name: /Reformer .* - \d\d:\d\d, Antonia/ }).first().click();
      const modal = page.getByRole("dialog", { name: /Foglalás:/ });
      await expect(modal).toBeVisible();
      await modal.getByRole("button", { name: "Tovább" }).click();
      await page.getByLabel("Név", { exact: true }).fill("Mobil Mónika");
      await page.getByLabel("Email").fill("mobil@example.com");
      await page.getByLabel("Telefonszám").fill("+36 30 111 2233");
      await modal.getByRole("button", { name: "Tovább" }).click();
      const pay = modal.getByRole("button", { name: "Fizetés bankkártyával" });
      await pay.scrollIntoViewIfNeeded();
      await expect(pay).toBeVisible();
      await page.screenshot({ path: `${OUT}/${width}-foglalas-fizetes.png` });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}
