import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("pass_types")
    .select("*")
    .order("sort_order") as { data: Record<string, unknown>[] | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, occasions, price_huf, valid_days, description, is_active, sort_order } =
    body;

  if (!name || !occasions || price_huf === undefined) {
    return NextResponse.json(
      { error: "A nev, alkalmak szama es ar kitoltese kotelezo." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("pass_types")
    .insert({
      name,
      occasions,
      price_huf,
      valid_days: valid_days ?? 30,
      description: description ?? null,
      is_active: is_active ?? true,
      sort_order: sort_order ?? 0,
    } as never)
    .select()
    .single() as { data: Record<string, unknown> | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
