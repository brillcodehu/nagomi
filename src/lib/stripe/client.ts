import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Helyi fejlesztéshez és az E2E csomaghoz a Stripe API egy mock szerverre
 * irányítható (stripe-mock). Ha a STRIPE_API_HOST üres, az éles viselkedés marad.
 */
function mockConfig(): Partial<Stripe.StripeConfig> {
  const host = process.env.STRIPE_API_HOST?.trim();
  if (!host) return {};
  const port = process.env.STRIPE_API_PORT?.trim();
  const protocol = process.env.STRIPE_API_PROTOCOL?.trim();
  return {
    host,
    ...(port ? { port } : {}),
    ...(protocol ? { protocol: protocol as "http" | "https" } : {}),
  };
}

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
      ...mockConfig(),
    });
  }
  return _stripe;
}

// Lazy proxy so the module can be imported at build time without crashing
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
