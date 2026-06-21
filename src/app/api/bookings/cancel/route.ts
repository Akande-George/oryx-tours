import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { bookingCancellation } from "@/lib/email/templates";
import type { Booking } from "@/types";

export async function POST(req: Request) {
  let body: { bookingId?: string };
  try {
    body = (await req.json()) as { bookingId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.bookingId) {
    return NextResponse.json(
      { error: "bookingId required" },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: bookingRow, error } = await supabase
    .from("bookings")
    .update({ status: "Cancelled" })
    .eq("id", body.bookingId)
    .select()
    .single();

  if (error || !bookingRow) {
    return NextResponse.json(
      { error: error?.message ?? "Could not cancel" },
      { status: 500 },
    );
  }

  const booking = bookingRow as Booking;

  try {
    if (booking.customerId) {
      const profileResp = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", booking.customerId)
        .maybeSingle();
      const customer = profileResp.data as
        | { name?: string; email?: string }
        | null;
      if (customer?.email) {
        await sendEmail({
          to: customer.email,
          ...bookingCancellation({
            booking,
            customerName: customer.name ?? "",
          }),
        });
      }
    }
  } catch (e) {
    console.error("[cancel] email failed", e);
  }

  return NextResponse.json({ ok: true, booking });
}
