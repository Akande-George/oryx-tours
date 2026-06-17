import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/format";
import { PrintTrigger } from "@/components/passes/PrintTrigger";
import type { Booking, Tour } from "@/types";
import type { AuthProfile } from "@/lib/auth";

type PassPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ auto?: string }>;
};

const qrUrl = (data: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;

export const dynamic = "force-dynamic";

export default async function BookingPassPage({
  params,
  searchParams,
}: PassPageProps) {
  const { id } = await params;
  const { auto } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const bookingResp = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const booking = bookingResp.data as Booking | null;

  if (!booking) return notFound();

  const [tourResp, customerResp] = await Promise.all([
    supabase
      .from("tours")
      .select("*")
      .eq("id", booking.tourId)
      .maybeSingle(),
    booking.customerId
      ? supabase
          .from("profiles")
          .select("id, name, email, role, status, operatorId, companyName")
          .eq("id", booking.customerId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const tour = tourResp.data as Tour | null;
  const customer = customerResp.data as AuthProfile | null;

  return (
    <article className="pass-card">
      <header className="pass-header">
        <p className="pass-eyebrow">Oryx Tours · Booking pass</p>
        <h1>{booking.tourTitle}</h1>
        {tour ? (
          <p style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
            {tour.location}
            {tour.region ? ` · ${tour.region}` : ""}
          </p>
        ) : null}
      </header>

      <div className="pass-body">
        <div className="pass-qr">
          <img src={qrUrl(booking.reference)} alt={`QR ${booking.reference}`} />
          <span className="pass-qr-caption">Scan at check-in</span>
        </div>

        <div className="pass-reference">{booking.reference}</div>

        <dl style={{ margin: "24px 0 0" }}>
          <div className="pass-row">
            <dt>Traveler</dt>
            <dd>{customer?.name ?? "—"}</dd>
          </div>
          <div className="pass-row">
            <dt>Departure</dt>
            <dd>{formatDate(booking.date)}</dd>
          </div>
          <div className="pass-row">
            <dt>Guests</dt>
            <dd>{booking.guests}</dd>
          </div>
          {tour ? (
            <div className="pass-row">
              <dt>Duration</dt>
              <dd>{tour.durationDays} days</dd>
            </div>
          ) : null}
          <div className="pass-row">
            <dt>Total</dt>
            <dd>{formatPrice(booking.price)}</dd>
          </div>
          <div className="pass-row">
            <dt>Payment</dt>
            <dd>{booking.paymentStatus ?? "—"}</dd>
          </div>
          <div className="pass-row">
            <dt>Status</dt>
            <dd>{booking.status}</dd>
          </div>
        </dl>

        <PrintTrigger auto={auto === "1"} />
      </div>

      <footer className="pass-footer">
        Present this pass on arrival · info@oryxgp.com
      </footer>
    </article>
  );
}
