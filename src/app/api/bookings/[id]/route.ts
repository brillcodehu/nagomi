import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/bookings/[id]
 *
 * Returns booking details by ID, joined with class and instructor info.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Foglalas azonosito szukseges" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        scheduled_class_id,
        class_date,
        customer_name,
        customer_email,
        customer_phone,
        status,
        payment_type,
        stripe_checkout_session_id,
        pass_id,
        amount_huf,
        cancelled_at,
        cancellation_reason,
        created_at,
        scheduled_classes (
          id,
          start_time,
          day_of_week,
          specific_date,
          class_types (
            name,
            slug,
            tagline,
            duration_min,
            price_huf,
            difficulty,
            is_private
          ),
          instructors (
            name,
            avatar_url
          )
        )
      `
      )
      .eq("id", id)
      .single() as { data: { id: string; scheduled_class_id: string; class_date: string; customer_name: string; customer_email: string; customer_phone: string; status: string; payment_type: string; stripe_checkout_session_id: string | null; pass_id: string | null; amount_huf: number | null; cancelled_at: string | null; cancellation_reason: string | null; created_at: string; scheduled_classes: { id: string; start_time: string; day_of_week: number | null; specific_date: string | null; class_types: { name: string; slug: string; tagline: string | null; duration_min: number; price_huf: number; difficulty: number; is_private: boolean }; instructors: { name: string; avatar_url: string | null } } | null } | null; error: { message: string } | null };

    if (error || !booking) {
      return Response.json(
        { error: "A foglalas nem talalhato" },
        { status: 404 }
      );
    }

    const sc = booking.scheduled_classes as unknown as {
      id: string;
      start_time: string;
      day_of_week: number | null;
      specific_date: string | null;
      class_types: {
        name: string;
        slug: string;
        tagline: string | null;
        duration_min: number;
        price_huf: number;
        difficulty: number;
        is_private: boolean;
      };
      instructors: {
        name: string;
        avatar_url: string | null;
      };
    };

    return Response.json({
      booking: {
        id: booking.id,
        classDate: booking.class_date,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        status: booking.status,
        paymentType: booking.payment_type,
        amountHuf: booking.amount_huf,
        cancelledAt: booking.cancelled_at,
        cancellationReason: booking.cancellation_reason,
        createdAt: booking.created_at,
        className: sc.class_types.name,
        classSlug: sc.class_types.slug,
        classTagline: sc.class_types.tagline,
        startTime: sc.start_time.slice(0, 5),
        durationMin: sc.class_types.duration_min,
        priceHuf: sc.class_types.price_huf,
        difficulty: sc.class_types.difficulty,
        isPrivate: sc.class_types.is_private,
        instructorName: sc.instructors.name,
        instructorAvatar: sc.instructors.avatar_url,
      },
    });
  } catch (error) {
    console.error("Booking detail API error:", error);
    return Response.json(
      { error: "Szerverhiba tortent" },
      { status: 500 }
    );
  }
}
