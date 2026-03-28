import { stripe } from "./client";
import type Stripe from "stripe";

interface CreateClassCheckoutParams {
  bookingId: string;
  className: string;
  classDate: string;
  startTime: string;
  instructorName: string;
  priceHuf: number;
  customerEmail: string;
  origin: string;
}

export async function createClassCheckoutSession(
  params: CreateClassCheckoutParams
): Promise<Stripe.Checkout.Session> {
  const {
    bookingId,
    className,
    classDate,
    startTime,
    instructorName,
    priceHuf,
    customerEmail,
    origin,
  } = params;

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    currency: "huf",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "huf",
          unit_amount: priceHuf,
          product_data: {
            name: `${className} – ${classDate} ${startTime}`,
            description: `Oktató: ${instructorName} | Nagomi Pilates Studio`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      booking_id: bookingId,
      type: "class_booking",
    },
    success_url: `${origin}/foglalas/sikeres?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/foglalas/megszakitva?session_id={CHECKOUT_SESSION_ID}`,
    expires_at: Math.floor(Date.now() / 1000) + 1800,
  });
}

interface CreatePassCheckoutParams {
  passTypeName: string;
  occasions: number;
  priceHuf: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  passTypeId: string;
  origin: string;
}

export async function createPassCheckoutSession(
  params: CreatePassCheckoutParams
): Promise<Stripe.Checkout.Session> {
  const {
    passTypeName,
    occasions,
    priceHuf,
    customerEmail,
    customerName,
    customerPhone,
    passTypeId,
    origin,
  } = params;

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    currency: "huf",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "huf",
          unit_amount: priceHuf,
          product_data: {
            name: `${passTypeName} – ${occasions} alkalom`,
            description: "Nagomi Pilates Studio bérlet",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "pass_purchase",
      pass_type_id: passTypeId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
    },
    success_url: `${origin}/foglalas/sikeres?session_id={CHECKOUT_SESSION_ID}&type=pass`,
    cancel_url: `${origin}/foglalas/megszakitva?session_id={CHECKOUT_SESSION_ID}`,
    expires_at: Math.floor(Date.now() / 1000) + 1800,
  });
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
