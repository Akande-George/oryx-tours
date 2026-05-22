"use client";

import { Badge } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

const statusStyles: Record<Booking["status"], string> = {
  Upcoming: "bg-emerald-100 text-emerald-800",
  Completed: "bg-slate-100 text-slate-800",
  Cancelled: "bg-rose-100 text-rose-700",
};

export function BookingCard({
  booking,
  onClick,
}: {
  booking: Booking;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "block w-full text-left",
        onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <Card
        className={cn(
          "overflow-hidden border-white/60 bg-white/80 shadow-[0_16px_36px_-28px_rgba(92,70,39,0.35)] transition-all",
          onClick && "hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-28px_rgba(92,70,39,0.45)]",
        )}
      >
        <div className={`h-16 bg-gradient-to-br ${booking.gradient}`} />
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{booking.tourTitle}</h3>
            <Badge
              className={`rounded-full text-xs ${statusStyles[booking.status]}`}
            >
              {booking.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatCompactDate(booking.date)} · {booking.guests} guests
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{booking.reference}</span>
            <span className="font-semibold text-primary">
              {formatPrice(booking.price)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
}
