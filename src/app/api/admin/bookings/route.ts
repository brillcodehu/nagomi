import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  let query = supabase
    .from("bookings")
    .select(
      "id, scheduled_class_id, class_date, customer_name, customer_email, customer_phone, status, payment_type, amount_huf, created_at, scheduled_classes(start_time, class_types(name))"
    )
    .order("class_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) {
    query = query.eq("status", status);
  }
  if (dateFrom) {
    query = query.gte("class_date", dateFrom);
  }
  if (dateTo) {
    query = query.lte("class_date", dateTo);
  }

  const { data, error } = await query as { data: { id: string; scheduled_class_id: string; class_date: string; customer_name: string; customer_email: string; customer_phone: string; status: string; payment_type: string; amount_huf: number | null; created_at: string; scheduled_classes: { start_time: string; class_types: { name: string } | null } | null }[] | null; error: { message: string } | null };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
