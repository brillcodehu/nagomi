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
  const { status } = body;

  const validStatuses = ["pending", "confirmed", "cancelled", "no_show"];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Ervenytelen statusz." },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = { status };

  // Ha lemondas, rogzitjuk az idopontot
  if (status === "cancelled") {
    updateData.cancelled_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(updateData as never)
    .eq("id", id)
    .select()
    .single() as { data: Record<string, unknown> | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
