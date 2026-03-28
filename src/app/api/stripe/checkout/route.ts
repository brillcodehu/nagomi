import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/checkout
 *
 * Thin redirect endpoint. The actual checkout logic lives in:
 * - /api/bookings (POST) for class booking checkout
 * - /api/passes (POST) for pass purchase checkout
 *
 * This route exists for backwards compatibility or direct Stripe
 * checkout initiation if needed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body as { type?: string };

    if (type === "class_booking") {
      return Response.json(
        {
          error: "Hasznald a /api/bookings POST endpointot ora foglalashoz",
          redirect: "/api/bookings",
        },
        { status: 400 }
      );
    }

    if (type === "pass_purchase") {
      return Response.json(
        {
          error: "Hasznald a /api/passes POST endpointot berletvasarlashoz",
          redirect: "/api/passes",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        error: "Ismeretlen checkout tipus. Hasznald a /api/bookings vagy /api/passes endpointokat.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Stripe checkout route error:", error);
    return Response.json(
      { error: "Szerverhiba tortent" },
      { status: 500 }
    );
  }
}
