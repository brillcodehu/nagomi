import { createAdminClient } from "@/lib/supabase/server";
import { createPassCheckoutSession } from "@/lib/stripe/helpers";
import { passPurchaseSchema } from "@/lib/utils/validators";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * POST /api/passes
 *
 * Purchase a pass via Stripe Checkout.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = passPurchaseSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Ervenytelen adatok", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { passTypeId, customerName, customerEmail, customerPhone } =
      parsed.data;

    const supabase = await createAdminClient();

    // Fetch pass type details
    const { data: passType, error: passTypeError } = await supabase
      .from("pass_types")
      .select("*")
      .eq("id", passTypeId)
      .eq("is_active", true)
      .single() as { data: { id: string; name: string; occasions: number; price_huf: number; valid_days: number; description: string | null; is_active: boolean; sort_order: number } | null; error: { message: string } | null };

    if (passTypeError || !passType) {
      return Response.json(
        { error: "A berlettipus nem talalhato vagy nem aktiv" },
        { status: 404 }
      );
    }

    const headersList = await headers();
    const origin =
      headersList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

    const session = await createPassCheckoutSession({
      passTypeName: passType.name,
      occasions: passType.occasions,
      priceHuf: passType.price_huf,
      customerEmail,
      customerName,
      customerPhone,
      passTypeId,
      origin,
    });

    return Response.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Pass purchase API error:", error);
    return Response.json(
      { error: "Szerverhiba tortent" },
      { status: 500 }
    );
  }
}
