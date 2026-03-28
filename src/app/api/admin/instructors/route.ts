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
    .from("instructors")
    .select("id, name, email, bio, avatar_url, is_active, created_at")
    .eq("is_active", true)
    .order("name") as { data: { id: string; name: string; email: string; bio: string | null; avatar_url: string | null; is_active: boolean; created_at: string }[] | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
