export const PORT = 3539;
export const BASE = `http://127.0.0.1:${PORT}`;

export const E2E_ENV = {
  DATABASE_URL:
    process.env.E2E_DATABASE_URL ?? "postgresql://postgres:dev@127.0.0.1:55482/nagomi",
  NEXTAUTH_SECRET: "e2e-secret-nagomi-local",
  AUTH_SECRET: "e2e-secret-nagomi-local",
  AUTH_TRUST_HOST: "true",
  NEXTAUTH_URL: BASE,
  NEXT_PUBLIC_SITE_URL: BASE,
  STRIPE_SECRET_KEY: "sk_test_mock",
  STRIPE_WEBHOOK_SECRET: "whsec_mock_local",
  STRIPE_API_HOST: "127.0.0.1",
  STRIPE_API_PORT: process.env.E2E_STRIPE_PORT ?? "12182",
  STRIPE_API_PROTOCOL: "http",
  INVOICE_PROVIDER: "mock",
  RESEND_API_KEY: "",
  EMAIL_LOG_FILE: process.env.E2E_EMAIL_LOG ?? "/tmp/nagomi-e2e-mail.log",
  SEED_ADMIN_PASSWORD: "E2e-Admin-Jelszo-1",
  TZ: "UTC",
};

/** Build-időben kell megadni (NEXT_PUBLIC_*): ezzel épül az E2E-hez használt next build. */
export const BUILD_ENV = {
  NEXT_PUBLIC_SITE_URL: BASE,
  NEXT_PUBLIC_GA_ID: "G-E2ETEST000",
};
