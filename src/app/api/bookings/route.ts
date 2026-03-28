import { createAdminClient } from "@/lib/supabase/server";
import { createClassCheckoutSession } from "@/lib/stripe/helpers";
import { bookingFormSchema } from "@/lib/utils/validators";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * POST /api/bookings
 *
 * Create a new booking. Supports two payment types:
 * - "stripe": creates a pending booking + Stripe Checkout session
 * - "pass": validates an existing pass and books immediately
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Ervenytelen adatok", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      scheduledClassId,
      classDate,
      customerName,
      customerEmail,
      customerPhone,
      paymentType,
      passId,
    } = parsed.data;

    const supabase = await createAdminClient();

    // Fetch class details for checkout session and validation
    const { data: scheduledClass, error: classError } = await supabase
      .from("scheduled_classes")
      .select(
        `
        id,
        start_time,
        max_spots_override,
        is_cancelled,
        class_types (
          name,
          slug,
          price_huf,
          max_capacity
        ),
        instructors (
          name
        )
      `
      )
      .eq("id", scheduledClassId)
      .single() as { data: { id: string; start_time: string; max_spots_override: number | null; is_cancelled: boolean; class_types: { name: string; slug: string; price_huf: number; max_capacity: number } | null; instructors: { name: string } | null } | null; error: { message: string } | null };

    if (classError || !scheduledClass) {
      return Response.json(
        { error: "Az ora nem talalhato" },
        { status: 404 }
      );
    }

    if (scheduledClass.is_cancelled) {
      return Response.json(
        { error: "Ez az ora torolve lett" },
        { status: 400 }
      );
    }

    const classType = scheduledClass.class_types as unknown as {
      name: string;
      slug: string;
      price_huf: number;
      max_capacity: number;
    };
    const instructor = scheduledClass.instructors as unknown as {
      name: string;
    };
    const maxSpots =
      scheduledClass.max_spots_override ?? classType.max_capacity;

    // Check available spots
    const { count: bookedCount, error: countError } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("scheduled_class_id", scheduledClassId)
      .eq("class_date", classDate)
      .in("status", ["pending", "confirmed"]);

    if (countError) {
      console.error("Booking count error:", countError);
      return Response.json(
        { error: "Nem sikerult ellenorizni a szabad helyeket" },
        { status: 500 }
      );
    }

    if ((bookedCount ?? 0) >= maxSpots) {
      return Response.json(
        { error: "CLASS_FULL", message: "Nincs tobb szabad hely" },
        { status: 409 }
      );
    }

    // ----- STRIPE PAYMENT -----
    if (paymentType === "stripe") {
      // Create booking via RPC with 'pending' status
      const { data: bookingId, error: bookError } = await supabase.rpc(
        "book_class" as never,
        {
          p_scheduled_class_id: scheduledClassId,
          p_class_date: classDate,
          p_customer_name: customerName,
          p_customer_email: customerEmail,
          p_customer_phone: customerPhone,
          p_payment_type: "stripe",
          p_amount_huf: classType.price_huf,
        } as never
      );

      if (bookError) {
        console.error("book_class RPC error:", bookError);

        // Handle unique constraint violation (duplicate booking)
        if (bookError.code === "23505") {
          return Response.json(
            {
              error: "DUPLICATE_BOOKING",
              message: "Mar van foglalasod erre az orara",
            },
            { status: 409 }
          );
        }

        // Handle CLASS_FULL from the DB function
        if (bookError.message?.includes("CLASS_FULL")) {
          return Response.json(
            { error: "CLASS_FULL", message: "Nincs tobb szabad hely" },
            { status: 409 }
          );
        }

        return Response.json(
          { error: "Nem sikerult letrehozni a foglalast" },
          { status: 500 }
        );
      }

      // Create Stripe Checkout session
      const headersList = await headers();
      const origin =
        headersList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

      const session = await createClassCheckoutSession({
        bookingId: bookingId as string,
        className: classType.name,
        classDate,
        startTime: scheduledClass.start_time.slice(0, 5),
        instructorName: instructor.name,
        priceHuf: classType.price_huf,
        customerEmail,
        origin,
      });

      // Save checkout session ID on the booking
      await supabase
        .from("bookings")
        .update({ stripe_checkout_session_id: session.id } as never)
        .eq("id", bookingId as string);

      return Response.json({ checkoutUrl: session.url });
    }

    // ----- PASS PAYMENT -----
    if (paymentType === "pass") {
      if (!passId) {
        return Response.json(
          { error: "PASS_INVALID", message: "Berlet azonosito szukseges" },
          { status: 400 }
        );
      }

      // Validate the pass
      const { data: pass, error: passError } = await supabase
        .from("customer_passes")
        .select("id, remaining_occasions, expires_at, is_active, customer_email")
        .eq("id", passId)
        .single() as { data: { id: string; remaining_occasions: number; expires_at: string; is_active: boolean; customer_email: string } | null; error: { message: string } | null };

      if (passError || !pass) {
        return Response.json(
          { error: "PASS_INVALID", message: "A berlet nem talalhato" },
          { status: 404 }
        );
      }

      if (!pass.is_active) {
        return Response.json(
          { error: "PASS_INVALID", message: "A berlet inaktiv" },
          { status: 400 }
        );
      }

      if (pass.remaining_occasions <= 0) {
        return Response.json(
          {
            error: "PASS_INVALID",
            message: "A berleten nem maradt felhasznalhato alkalom",
          },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      if (pass.expires_at < now) {
        return Response.json(
          { error: "PASS_INVALID", message: "A berlet lejart" },
          { status: 400 }
        );
      }

      // Verify pass belongs to the customer
      if (pass.customer_email !== customerEmail) {
        return Response.json(
          {
            error: "PASS_INVALID",
            message: "A berlet nem ehhez az email cimhez tartozik",
          },
          { status: 400 }
        );
      }

      // Create booking via RPC with pass
      const { data: bookingId, error: bookError } = await supabase.rpc(
        "book_class" as never,
        {
          p_scheduled_class_id: scheduledClassId,
          p_class_date: classDate,
          p_customer_name: customerName,
          p_customer_email: customerEmail,
          p_customer_phone: customerPhone,
          p_payment_type: "pass",
          p_pass_id: passId,
        } as never
      );

      if (bookError) {
        console.error("book_class RPC error (pass):", bookError);

        if (bookError.code === "23505") {
          return Response.json(
            {
              error: "DUPLICATE_BOOKING",
              message: "Mar van foglalasod erre az orara",
            },
            { status: 409 }
          );
        }

        if (bookError.message?.includes("CLASS_FULL")) {
          return Response.json(
            { error: "CLASS_FULL", message: "Nincs tobb szabad hely" },
            { status: 409 }
          );
        }

        if (bookError.message?.includes("PASS_INVALID")) {
          return Response.json(
            { error: "PASS_INVALID", message: "A berlet nem hasznalhato" },
            { status: 400 }
          );
        }

        return Response.json(
          { error: "Nem sikerult letrehozni a foglalast" },
          { status: 500 }
        );
      }

      // Decrement pass occasions
      await supabase
        .from("customer_passes")
        .update({
          remaining_occasions: pass.remaining_occasions - 1,
        } as never)
        .eq("id", passId);

      return Response.json({
        success: true,
        bookingId: bookingId as string,
      });
    }

    return Response.json(
      { error: "Ismeretlen fizetesi mod" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Bookings API error:", error);
    return Response.json(
      { error: "Szerverhiba tortent" },
      { status: 500 }
    );
  }
}
