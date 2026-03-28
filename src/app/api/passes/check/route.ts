import { createAdminClient } from "@/lib/supabase/server";
import { passCheckSchema } from "@/lib/utils/validators";

export const dynamic = "force-dynamic";

/**
 * POST /api/passes/check
 *
 * Check if a customer has active, non-expired passes by email.
 */
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
    const supabase = await createAdminClient();

    const now = new Date().toISOString();

    const { data: passes, error } = await supabase
      .from("customer_passes")
      .select(
        `
        id,
        remaining_occasions,
        expires_at,
        pass_types (
          name
        )
      `
      )
      .eq("customer_email", email)
      .eq("is_active", true)
      .gt("remaining_occasions", 0)
      .gt("expires_at", now) as { data: { id: string; remaining_occasions: number; expires_at: string; pass_types: { name: string } | null }[] | null; error: { message: string } | null };

    if (error) {
      console.error("Pass check query error:", error);
      return Response.json(
        { error: "Nem sikerult lekerni a berleteket" },
        { status: 500 }
      );
    }

    const result = (passes ?? []).map((pass) => {
      const passType = pass.pass_types as unknown as { name: string };
      return {
        id: pass.id,
        passTypeName: passType.name,
        remainingOccasions: pass.remaining_occasions,
        expiresAt: pass.expires_at,
      };
    });

    return Response.json({ passes: result });
  } catch (error) {
    console.error("Pass check API error:", error);
    return Response.json(
      { error: "Szerverhiba tortent" },
      { status: 500 }
    );
  }
}
