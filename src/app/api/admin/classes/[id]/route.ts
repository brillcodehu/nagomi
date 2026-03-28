import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { class_type_id, instructor_id, day_of_week, start_time, max_spots_override } =
    body;

  const { data, error } = await supabase
    .from("scheduled_classes")
    .update({
      class_type_id,
      instructor_id,
      day_of_week: day_of_week ?? null,
      start_time,
      max_spots_override: max_spots_override ?? null,
    } as never)
    .eq("id", id)
    .select()
    .single() as { data: Record<string, unknown> | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Soft delete: is_cancelled = true
  const { error } = await supabase
    .from("scheduled_classes")
    .update({ is_cancelled: true } as never)
    .eq("id", id) as { error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
