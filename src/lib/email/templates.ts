import "server-only";

import type { Booking, Tour, Vehicle } from "@/types";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const brandColor = "#c79a78";

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const shell = (title: string, bodyHtml: string) => `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f1e9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2a241a;">
  <div style="max-width:560px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px -20px rgba(60,40,20,0.25);">
    <div style="background:linear-gradient(135deg,#efd9bf,${brandColor});padding:24px 28px;">
      <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#2a1d10;opacity:0.65;">Oryx Group</p>
      <h1 style="margin:6px 0 0;font-size:22px;color:#2a1d10;">${escape(title)}</h1>
    </div>
    <div style="padding:28px;">
      ${bodyHtml}
    </div>
    <div style="background:#2a241a;color:#f6f1e9;padding:14px 28px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-align:center;">
      info@oryxgp.com
    </div>
  </div>
</body>
</html>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;color:#6b5a45;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;border-bottom:1px dashed rgba(60,40,20,0.12);">${escape(label)}</td>
    <td style="padding:10px 0;text-align:right;font-weight:600;border-bottom:1px dashed rgba(60,40,20,0.12);">${escape(value)}</td>
  </tr>
`;

const button = (href: string, text: string) => `
  <p style="margin:24px 0 0;text-align:center;">
    <a href="${escape(href)}" style="display:inline-block;background:#2a241a;color:#f6f1e9;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;font-size:14px;">${escape(text)}</a>
  </p>
`;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

export type BookingConfirmationArgs = {
  booking: Booking;
  tour?: Tour | null;
  customerName: string;
};

export const bookingConfirmation = ({
  booking,
  tour,
  customerName,
}: BookingConfirmationArgs) => {
  const title = "Booking confirmed";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(customerName.split(" ")[0] || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      Your booking for <strong style="color:#2a1d10;">${escape(booking.tourTitle)}</strong>
      is confirmed. Below are your details — keep this email handy at check-in.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Reference", booking.reference)}
      ${row("Departure", booking.date)}
      ${row("Guests", String(booking.guests))}
      ${tour ? row("Location", `${tour.location}${tour.region ? ` · ${tour.region}` : ""}`) : ""}
      ${tour ? row("Duration", `${tour.durationDays} days`) : ""}
      ${row("Total paid", formatPrice(booking.paidAmount ?? booking.price))}
    </table>
    ${button(`${appUrl}/passes/booking/${booking.id}?auto=1`, "Download booking pass")}
    <p style="margin:24px 0 0;color:#8a7860;font-size:12px;text-align:center;">
      Questions? Reply to this email or write to info@oryxgp.com
    </p>
  `;

  return {
    subject: `${title} · ${booking.reference}`,
    html: shell(title, body),
    text: `Booking confirmed — ${booking.tourTitle}\nReference: ${booking.reference}\nDeparture: ${booking.date}\nGuests: ${booking.guests}\nTotal paid: ${formatPrice(booking.paidAmount ?? booking.price)}\n\nDownload your pass: ${appUrl}/passes/booking/${booking.id}`,
  };
};

export type BookingCancellationArgs = {
  booking: Booking;
  customerName: string;
};

export const bookingCancellation = ({
  booking,
  customerName,
}: BookingCancellationArgs) => {
  const title = "Booking cancelled";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(customerName.split(" ")[0] || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      Your booking <strong>${escape(booking.reference)}</strong> for
      <strong>${escape(booking.tourTitle)}</strong> on ${escape(booking.date)} has been cancelled.
    </p>
    <p style="margin:0 0 8px;color:#5c4f3d;">
      If a refund applies, our team will follow up within 3 business days.
    </p>
    ${button(`${appUrl}/dashboard/bookings`, "View bookings")}
  `;

  return {
    subject: `${title} · ${booking.reference}`,
    html: shell(title, body),
    text: `Booking ${booking.reference} for ${booking.tourTitle} on ${booking.date} has been cancelled.`,
  };
};

export type PartnerBookingAlertArgs = {
  booking: Booking;
  tour?: Tour | null;
  partnerFirstName: string;
};

export const partnerBookingAlert = ({
  booking,
  tour,
  partnerFirstName,
}: PartnerBookingAlertArgs) => {
  const title = "New booking received";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(partnerFirstName || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      A new booking just came in for <strong>${escape(booking.tourTitle)}</strong>.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Reference", booking.reference)}
      ${row("Departure", booking.date)}
      ${row("Guests", String(booking.guests))}
      ${tour ? row("Location", tour.location) : ""}
      ${row("Total", formatPrice(booking.price))}
    </table>
    ${button(`${appUrl}/partner/bookings`, "Open bookings")}
  `;
  return {
    subject: `New booking · ${booking.reference}`,
    html: shell(title, body),
  };
};

export type WelcomeArgs = {
  name: string;
  role: "customer" | "partner" | "admin";
};

export const welcome = ({ name, role }: WelcomeArgs) => {
  const title = role === "partner" ? "Application received" : "Welcome to Oryx Group";
  const intro =
    role === "partner"
      ? "Thanks for applying to operate with Oryx Group. Our team is reviewing your application — we'll be in touch within 48 hours."
      : "Thanks for joining Oryx Group. Browse curated tours, save favourites, and your concierge is one tap away.";
  const cta = role === "partner" ? "/partner" : "/tours";
  const ctaText = role === "partner" ? "Visit partner portal" : "Explore tours";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(name.split(" ")[0] || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">${escape(intro)}</p>
    ${button(`${appUrl}${cta}`, ctaText)}
  `;
  return {
    subject: title,
    html: shell(title, body),
  };
};

export type VehicleInfoArgs = {
  vehicle: Vehicle;
  customerName: string;
};

export const vehicleInfo = ({ vehicle, customerName }: VehicleInfoArgs) => {
  const title = `${vehicle.name} · Fleet details`;
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(customerName.split(" ")[0] || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      Here's a summary of the vehicle you reserved.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Vehicle", vehicle.name)}
      ${row("Category", vehicle.fleetCategory)}
      ${row("Capacity", `${vehicle.capacity} passengers`)}
      ${row("Half day", formatPrice(vehicle.halfDayPrice))}
      ${row("Full day", formatPrice(vehicle.fullDayPrice))}
      ${row("Airport transfer", formatPrice(vehicle.transferPrice))}
      ${row("Point-to-point", formatPrice(vehicle.pointToPointPrice ?? 0))}
    </table>
    ${button(`${appUrl}/passes/vehicle/${vehicle.id}`, "Download fleet pass")}
  `;
  return { subject: title, html: shell(title, body) };
};
