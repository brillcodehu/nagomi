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
    .from("scheduled_classes")
    .select(
      "id, class_type_id, instructor_id, day_of_week, start_time, max_spots_override, is_cancelled, notes, specific_date, created_at, class_types(name, max_capacity), instructors(name)"
    )
    .eq("is_cancelled", false)
    .order("day_of_week")
    .order("start_time") as { data: { id: string; class_type_id: string; instructor_id: string; day_of_week: number | null; start_time: string; max_spots_override: number | null; is_cancelled: boolean; notes: string | null; specific_date: string | null; created_at: string; class_types: { name: string; max_capacity: number } | null; instructors: { name: string } | null }[] | null; error: { message: string } | null };

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
  const { class_type_id, instructor_id, day_of_week, start_time, max_spots_override } =
    body;

  if (!class_type_id || !instructor_id || !start_time) {
    return NextResponse.json(
      { error: "Hianyzo kotelezo mezok." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("scheduled_classes")
    .insert({
      class_type_id,
      instructor_id,
      day_of_week: day_of_week ?? null,
      start_time,
      max_spots_override: max_spots_override ?? null,
    } as never)
    .select()
    .single() as { data: Record<string, unknown> | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
