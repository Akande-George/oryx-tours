import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPaymentStatus } from "@/lib/payments/myfatoorah";
import { sendEmail } from "@/lib/email/resend";
import {
  bookingConfirmation,
  partnerBookingAlert,
} from "@/lib/email/templates";
import type { Booking, Tour } from "@/types";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const redirect = (path: string) => NextResponse.redirect(`${appUrl}${path}`);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const paymentId = url.searchParams.get("paymentId");
  const bookingId = url.searchParams.get("bookingId");
  const failedFlag = url.searchParams.get("failed") === "1";

  if (!bookingId) {
    return redirect("/dashboard/bookings?payment=missing");
  }

  const supabase = await createSupabaseServerClient();

  if (failedFlag || !paymentId) {
    await supabase
      .from("bookings")
      .update({ paymentStatus: "failed", status: "Cancelled" })
      .eq("id", bookingId);
    return redirect("/dashboard/bookings?payment=failed");
  }

  try {
    const status = await getPaymentStatus({
      key: paymentId,
      keyType: "PaymentId",
    });

    if (status.InvoiceStatus === "Paid") {
      const { data: bookingRow } = await supabase
        .from("bookings")
        .update({
          paymentStatus: "paid",
          paidAmount: status.InvoiceValue,
          paymentId,
        })
        .eq("id", bookingId)
        .select()
        .single();

      const booking = bookingRow as Booking | null;
      if (booking) {
        await dispatchConfirmationEmails(supabase, booking);
      }

      return redirect("/dashboard/bookings?payment=success");
    }

    await supabase
      .from("bookings")
      .update({ paymentStatus: "failed", status: "Cancelled", paymentId })
      .eq("id", bookingId);
    return redirect(
      `/dashboard/bookings?payment=failed&reason=${encodeURIComponent(status.InvoiceStatus)}`,
    );
  } catch (e) {
    console.error("[callback] verification failed", e);
    return redirect(
      `/dashboard/bookings?payment=error&reason=${encodeURIComponent((e as Error).message)}`,
    );
  }
}

type SupaClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function dispatchConfirmationEmails(
  supabase: SupaClient,
  booking: Booking,
) {
  try {
    const tourResp = booking.tourId
      ? await supabase
          .from("tours")
          .select("*")
          .eq("id", booking.tourId)
          .maybeSingle()
      : { data: null };
    const tour = tourResp.data as Tour | null;

    const customerResp = booking.customerId
      ? await supabase
          .from("profiles")
          .select("name, email")
          .eq("id", booking.customerId)
          .maybeSingle()
      : { data: null };
    const customer = customerResp.data as
      | { name?: string; email?: string }
      | null;

    if (customer?.email) {
      const confirmation = bookingConfirmation({
        booking,
        tour,
        customerName: customer.name ?? "",
      });
      await sendEmail({ to: customer.email, ...confirmation });
    }

    if (tour?.operatorId) {
      const partnerResp = await supabase
        .from("profiles")
        .select("name, email")
        .eq("operatorId", tour.operatorId)
        .eq("role", "partner")
        .maybeSingle();
      const partner = partnerResp.data as
        | { name?: string; email?: string }
        | null;
      if (partner?.email) {
        const alert = partnerBookingAlert({
          booking,
          tour,
          partnerFirstName: (partner.name ?? "").split(" ")[0] ?? "",
        });
        await sendEmail({ to: partner.email, ...alert });
      }
    }
  } catch (e) {
    console.error("[callback] email dispatch failed", e);
  }
}
