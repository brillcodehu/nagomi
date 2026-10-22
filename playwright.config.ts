import { defineConfig, devices } from "@playwright/test";
import { BASE, E2E_ENV, PORT } from "./tests/e2e/env";

/**
 * E2E csomag helyi környezetre, mock szolgáltatókkal:
 *  - Postgres:    127.0.0.1:55482 (docker, nagomi-dev-pg)
 *  - stripe-mock: 127.0.0.1:12182 (docker, stripe/stripe-mock:v0.197.0)
 *  - app:         127.0.0.1:3539 (next start az előzetes next build után)
 * Az éles Stripe-kulcs és az éles adatbázis kizárt: a globalSetup csak helyi
 * adatbázisra fut, a Stripe kulcs mock érték.
 * Részletek: README.md, "Tesztek" fejezet.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  outputDir: "./tests/e2e/.results",
  use: {
    baseURL: BASE,
    // A SmoothScroll, a GSAP-belépők és a kurzor ne akadályozzák a próbát.
    reducedMotion: "reduce",
    timezoneId: "Europe/Budapest",
    locale: "hu-HU",
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } }],
  webServer: {
    command: `npm run start -- -p ${PORT} -H 127.0.0.1`,
    url: `${BASE}/robots.txt`,
    reuseExistingServer: true,
    timeout: 120_000,
    env: E2E_ENV as unknown as Record<string, string>,
  },
});
