import Link from "next/link";
import { ActionButton, Input } from "@/components/atoms";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PaymentMethods } from "@/components/organisms/PaymentMethods";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionHeading
          title="Checkout & payments"
          subtitle="Complete your reservation with secure payment options."
        />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
            <div className="space-y-3">
              <p className="text-sm font-semibold">Payment method</p>
              <PaymentMethods />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Cardholder name" />
              <Input placeholder="Card number" />
              <Input placeholder="MM/YY" />
              <Input placeholder="CVC" />
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="Promo code" />
              <ActionButton
                label="Apply"
                variant="outline"
                className="rounded-full"
                message="Promo code applied."
              />
            </div>
            <ActionButton
              label="Confirm payment"
              className="w-full rounded-full"
              action="navigate"
              href="/dashboard/bookings"
            />
          </div>
          <div className="space-y-4">
            <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
              <CardContent className="space-y-4 p-5">
                <p className="text-sm font-semibold">Order summary</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Royal Dune Retreat
                  </span>
                  <span>{formatPrice(3360)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Private transfer
                  </span>
                  <span>{formatPrice(240)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(3600)}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-white/80">
              <CardContent className="space-y-2 p-5 text-sm">
                <p className="font-semibold">Booking confirmed</p>
                <p className="text-muted-foreground">
                  A confirmation email and itinerary are ready in your travel
                  lounge.
                </p>
                <Link
                  href="/dashboard/bookings"
                  className={buttonVariants({
                    variant: "outline",
                    className: "rounded-full",
                  })}
                >
                  View confirmation
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
