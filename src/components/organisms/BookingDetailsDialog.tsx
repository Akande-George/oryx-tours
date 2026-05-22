"use client";

import { ActionButton } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatPrice } from "@/lib/format";
import type { Booking } from "@/types";

type BookingDetailsDialogProps = {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {booking ? (
          <>
            <DialogHeader>
              <DialogTitle>{booking.tourTitle}</DialogTitle>
              <DialogDescription>
                Booking ref {booking.reference} · {formatDate(booking.date)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Guests:</span>{" "}
                {booking.guests}
              </p>
              <p>
                <span className="font-medium text-foreground">Status:</span>{" "}
                {booking.status}
              </p>
              <p>
                <span className="font-medium text-foreground">Total:</span>{" "}
                {formatPrice(booking.price)}
              </p>
              <p>
                <span className="font-medium text-foreground">Concierge:</span>{" "}
                Assigned
              </p>
            </div>
            <ActionButton
              label="Download receipt"
              variant="outline"
              className="rounded-full"
              action="print"
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
