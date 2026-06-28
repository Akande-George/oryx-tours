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
      is confirmed. Below are your details - keep this email handy at check-in.
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
    text: `Booking confirmed - ${booking.tourTitle}\nReference: ${booking.reference}\nDeparture: ${booking.date}\nGuests: ${booking.guests}\nTotal paid: ${formatPrice(booking.paidAmount ?? booking.price)}\n\nDownload your pass: ${appUrl}/passes/booking/${booking.id}`,
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

export type PasswordResetArgs = {
  email: string;
  resetUrl: string;
};

export const passwordReset = ({ email, resetUrl }: PasswordResetArgs) => {
  const title = "Reset your password";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi,</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      We received a request to reset the password for the Oryx Group account
      tied to <strong>${escape(email)}</strong>. Click the button below to
      choose a new password. The link expires in 60 minutes.
    </p>
    ${button(resetUrl, "Reset password")}
    <p style="margin:24px 0 0;color:#8a7860;font-size:12px;text-align:center;">
      Didn't request this? You can safely ignore this email - your password
      won't change.
    </p>
  `;
  return {
    subject: title,
    html: shell(title, body),
    text: `Reset your Oryx Group password: ${resetUrl}\nThis link expires in 60 minutes.`,
  };
};

export type PersonalizedRequestEmailArgs = {
  name: string;
  email: string;
  destination: string;
  startDate: string;
  endDate?: string;
  partySize: number;
  experiences: string[];
  budget: string;
  budgetAmount?: string;
  pace: string;
  lodging: string;
  phone?: string;
  notes?: string;
};

// Confirmation sent to the traveler who submitted the request.
export const personalizedRequestCustomer = (
  args: PersonalizedRequestEmailArgs,
) => {
  const title = "We're designing your trip";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(args.name.split(" ")[0] || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      Thank you for your personalized trip request. Our concierge team is
      putting together a tailored itinerary and will be in touch within 24
      hours. Here's what we captured:
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Destination", args.destination)}
      ${row("Dates", `${args.startDate}${args.endDate ? ` → ${args.endDate}` : ""}`)}
      ${row("Travelers", String(args.partySize))}
      ${args.experiences.length ? row("Experiences", args.experiences.join(", ")) : ""}
      ${row("Budget", `${args.budget}${args.budgetAmount ? ` (${args.budgetAmount})` : ""}`)}
      ${row("Pace", args.pace)}
      ${row("Lodging", args.lodging)}
    </table>
    <p style="margin:24px 0 0;color:#8a7860;font-size:12px;text-align:center;">
      Need to add something? Reply to this email or write to info@oryxgp.com
    </p>
  `;
  return {
    subject: title,
    html: shell(title, body),
    text: `Thanks ${args.name}, we received your personalized trip request for ${args.destination} and will reply within 24 hours.`,
  };
};

// Alert sent to the concierge/admin team with the full brief.
export const personalizedRequestConcierge = (
  args: PersonalizedRequestEmailArgs,
) => {
  const title = "New personalized trip request";
  const body = `
    <p style="margin:0 0 20px;color:#5c4f3d;">
      A new personalized trip request just came in.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Name", args.name)}
      ${row("Email", args.email)}
      ${args.phone ? row("Phone", args.phone) : ""}
      ${row("Destination", args.destination)}
      ${row("Dates", `${args.startDate}${args.endDate ? ` → ${args.endDate}` : ""}`)}
      ${row("Travelers", String(args.partySize))}
      ${args.experiences.length ? row("Experiences", args.experiences.join(", ")) : ""}
      ${row("Budget", `${args.budget}${args.budgetAmount ? ` (${args.budgetAmount})` : ""}`)}
      ${row("Pace", args.pace)}
      ${row("Lodging", args.lodging)}
    </table>
    ${
      args.notes
        ? `<p style="margin:16px 0 0;color:#5c4f3d;"><strong>Notes:</strong><br/>${escape(args.notes)}</p>`
        : ""
    }
    ${button(`${appUrl}/admin/requests`, "Open request inbox")}
  `;
  return {
    subject: `New trip request · ${args.destination} · ${args.name}`,
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
      ? "Thanks for applying to operate with Oryx Group. Our team is reviewing your application - we'll be in touch within 48 hours."
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

export type PartnerApplicationAlertArgs = {
  applicantName: string;
  applicantEmail: string;
  companyName?: string;
  applicationId: string;
};

export const partnerApplicationAlert = ({
  applicantName,
  applicantEmail,
  companyName,
  applicationId,
}: PartnerApplicationAlertArgs) => {
  const title = "New partner application";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">A new operator has applied to join Oryx Group.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Name", applicantName)}
      ${row("Email", applicantEmail)}
      ${companyName ? row("Company", companyName) : ""}
      ${row("Reference", applicationId.slice(0, 8))}
    </table>
    ${button(`${appUrl}/admin/partners`, "Review application")}
  `;
  return { subject: title, html: shell(title, body) };
};

export type PartnerStatusUpdateArgs = {
  partnerName: string;
  status: "active" | "rejected";
};

export const partnerStatusUpdate = ({
  partnerName,
  status,
}: PartnerStatusUpdateArgs) => {
  const approved = status === "active";
  const title = approved
    ? "Welcome to the Oryx Group network"
    : "Partner application update";
  const body = approved
    ? `
      <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(partnerName.split(" ")[0] || "there")},</p>
      <p style="margin:0 0 20px;color:#5c4f3d;">
        Good news - your operator account has been <strong>approved</strong>.
        You can now start publishing tours, adding vehicles, and accepting
        bookings.
      </p>
      ${button(`${appUrl}/partner`, "Open partner portal")}
    `
    : `
      <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(partnerName.split(" ")[0] || "there")},</p>
      <p style="margin:0 0 20px;color:#5c4f3d;">
        Thank you for your interest in operating with Oryx Group. After
        reviewing your application, we are not able to onboard you at this
        time.
      </p>
      <p style="margin:0 0 8px;color:#5c4f3d;">
        Reply to this email and our team can share more context or suggest a
        next step.
      </p>
    `;
  return { subject: title, html: shell(title, body) };
};

export type TourPublishedArgs = {
  tour: Tour;
  partnerFirstName: string;
  isNew: boolean;
};

export const tourPublished = ({
  tour,
  partnerFirstName,
  isNew,
}: TourPublishedArgs) => {
  const title = isNew ? "Tour published" : "Tour updated";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(partnerFirstName || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      Your tour <strong>${escape(tour.title)}</strong> is
      ${isNew ? "now live" : "updated"} on Oryx Group.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Title", tour.title)}
      ${row("Location", `${tour.location}${tour.region ? ` · ${tour.region}` : ""}`)}
      ${row("Duration", `${tour.durationDays} days`)}
      ${row("Group size", tour.groupSize)}
      ${row("Price from", formatPrice(tour.priceFrom))}
      ${row("Category", tour.category)}
    </table>
    ${button(`${appUrl}/tours/${tour.slug}`, "View on site")}
  `;
  return { subject: `${title} · ${tour.title}`, html: shell(title, body) };
};

export type VehiclePublishedArgs = {
  vehicle: Vehicle;
  partnerFirstName: string;
  isNew: boolean;
};

export const vehiclePublished = ({
  vehicle,
  partnerFirstName,
  isNew,
}: VehiclePublishedArgs) => {
  const title = isNew ? "Vehicle published" : "Vehicle updated";
  const body = `
    <p style="margin:0 0 16px;color:#5c4f3d;">Hi ${escape(partnerFirstName || "there")},</p>
    <p style="margin:0 0 20px;color:#5c4f3d;">
      ${isNew ? "We've added" : "We've updated"} <strong>${escape(vehicle.name)}</strong>
      to your fleet on Oryx Group.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Vehicle", vehicle.name)}
      ${row("Category", vehicle.fleetCategory)}
      ${row("Type", vehicle.vehicleType ?? "-")}
      ${row("Capacity", `${vehicle.capacity} passengers`)}
      ${row("Half day", formatPrice(vehicle.halfDayPrice))}
      ${row("Airport transfer", formatPrice(vehicle.transferPrice))}
      ${row("Point-to-point", formatPrice(vehicle.pointToPointPrice ?? 0))}
    </table>
    ${button(`${appUrl}/partner/fleet`, "Open fleet")}
  `;
  return { subject: `${title} · ${vehicle.name}`, html: shell(title, body) };
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
