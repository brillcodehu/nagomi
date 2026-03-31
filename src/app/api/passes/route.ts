import { db } from "@/lib/db";
import { passTypes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createPassCheckoutSession } from "@/lib/stripe/helpers";
import { passPurchaseSchema } from "@/lib/utils/validators";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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

    const [passType] = await db
      .select()
      .from(passTypes)
      .where(and(eq(passTypes.id, passTypeId), eq(passTypes.isActive, true)))
      .limit(1);

    if (!passType) {
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
      priceHuf: passType.priceHuf,
      customerEmail,
      customerName,
      customerPhone,
      passTypeId,
      origin,
    });

    return Response.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Pass purchase API error:", error);
    return Response.json({ error: "Szerverhiba tortent" }, { status: 500 });
  }
}
