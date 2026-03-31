import { db } from "@/lib/db";
import { customerPasses, passTypes } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { passCheckSchema } from "@/lib/utils/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = passCheckSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Ervenytelen email cim", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const passes = await db
      .select({
        id: customerPasses.id,
        remainingOccasions: customerPasses.remainingOccasions,
        expiresAt: customerPasses.expiresAt,
        passTypeName: passTypes.name,
      })
      .from(customerPasses)
      .innerJoin(passTypes, eq(customerPasses.passTypeId, passTypes.id))
      .where(
        and(
          eq(customerPasses.customerEmail, email),
          eq(customerPasses.isActive, true),
          gt(customerPasses.remainingOccasions, 0),
          gt(customerPasses.expiresAt, new Date())
        )
      );

    const result = passes.map((pass) => ({
      id: pass.id,
      passTypeName: pass.passTypeName,
      remainingOccasions: pass.remainingOccasions,
      expiresAt: pass.expiresAt,
    }));

    return Response.json({ passes: result });
  } catch (error) {
    console.error("Pass check API error:", error);
    return Response.json({ error: "Szerverhiba tortent" }, { status: 500 });
  }
}
