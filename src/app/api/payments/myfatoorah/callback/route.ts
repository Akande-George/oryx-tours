import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPaymentStatus } from "@/lib/payments/myfatoorah";

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
      await supabase
        .from("bookings")
        .update({
          paymentStatus: "paid",
          paidAmount: status.InvoiceValue,
          paymentId,
        })
        .eq("id", bookingId);
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
