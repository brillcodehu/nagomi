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
    .from("class_types")
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
  const {
    name,
    slug,
    description,
    tagline,
    duration_min,
    max_capacity,
    price_huf,
    difficulty,
    is_private,
    sort_order,
  } = body;

  if (!name || price_huf === undefined) {
    return NextResponse.json(
      { error: "A nev es az ar kitoltese kotelezo." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("class_types")
    .insert({
      name,
      slug,
      description: description ?? null,
      tagline: tagline ?? null,
      duration_min: duration_min ?? 55,
      max_capacity: max_capacity ?? 6,
      price_huf,
      difficulty: difficulty ?? 1,
      is_private: is_private ?? false,
      sort_order: sort_order ?? 0,
    } as never)
    .select()
    .single() as { data: Record<string, unknown> | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
