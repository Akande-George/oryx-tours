import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendPayment } from "@/lib/payments/myfatoorah";
import type { Booking } from "@/types";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const generateReference = () => {
  const part = Math.floor(Math.random() * 1_000_000)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `OT-${part}`;
};

type InitiateBody = {
  tourId: string;
  date: string;
  guests: number;
};

export async function POST(req: Request) {
  let body: InitiateBody;
  try {
    body = (await req.json()) as InitiateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { tourId, date, guests } = body;
  if (!tourId || !date || !guests || guests < 1) {
    return NextResponse.json(
      { error: "tourId, date, and guests are required" },
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

  const { data: tour, error: tourErr } = await supabase
    .from("tours")
    .select("id, title, priceFrom, gradient")
    .eq("id", tourId)
    .maybeSingle();
  if (tourErr || !tour) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .maybeSingle();

  const price = Number(tour.priceFrom) * guests;
  const bookingId = crypto.randomUUID();
  const reference = generateReference();

  const newBooking: Booking = {
    id: bookingId,
    tourId: tour.id,
    tourTitle: tour.title,
    date,
    guests,
    status: "Upcoming",
    price,
    reference,
    gradient: tour.gradient,
    customerId: user.id,
    paymentStatus: "pending",
  };

  const { error: insertErr } = await supabase.from("bookings").insert(newBooking);
  if (insertErr) {
    console.error("[initiate] booking insert failed", insertErr);
    return NextResponse.json(
      { error: `Could not create booking: ${insertErr.message}` },
      { status: 500 },
    );
  }

  const callbackUrl = `${appUrl}/api/payments/myfatoorah/callback?bookingId=${bookingId}`;
  const errorUrl = `${appUrl}/api/payments/myfatoorah/callback?bookingId=${bookingId}&failed=1`;

  try {
    const result = await sendPayment({
      invoiceValue: price,
      customerName: profile?.name ?? user.email ?? "Oryx traveler",
      customerEmail: profile?.email ?? user.email ?? undefined,
      customerReference: bookingId,
      callbackUrl,
      errorUrl,
    });

    await supabase
      .from("bookings")
      .update({ paymentId: String(result.InvoiceId) })
      .eq("id", bookingId);

    return NextResponse.json({
      paymentUrl: result.InvoiceURL,
      invoiceId: result.InvoiceId,
      bookingId,
    });
  } catch (e) {
    console.error("[initiate] sendPayment failed", e);
    await supabase
      .from("bookings")
      .update({ paymentStatus: "failed", status: "Cancelled" })
      .eq("id", bookingId);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 502 },
    );
  }
}
