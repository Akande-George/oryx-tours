"use client";

import { useState } from "react";
import { ActionButton, Button } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { updateBookingStatus } from "@/lib/supabase/data";
import { formatDate, formatPrice } from "@/lib/format";
import type { Booking, BookingStatus } from "@/types";

type BookingDetailsDialogProps = {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, status: BookingStatus) => void;
  editable?: boolean;
  cancellable?: boolean;
};

const statusOptions: BookingStatus[] = ["Upcoming", "Completed", "Cancelled"];

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
  onStatusChange,
  editable = false,
  cancellable = false,
}: BookingDetailsDialogProps) {
  const [saving, setSaving] = useState(false);

  const handleStatus = async (next: BookingStatus) => {
    if (!booking || next === booking.status) return;
    setSaving(true);
    try {
      await updateBookingStatus(
        createSupabaseBrowserClient(),
        booking.id,
        next,
      );
      onStatusChange?.(booking.id, next);
    } catch (e) {
      window.alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

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
              {editable ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Status</Label>
                  <Select
                    value={booking.status}
                    onValueChange={(v) => handleStatus(v as BookingStatus)}
                    disabled={saving}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p>
                  <span className="font-medium text-foreground">Status:</span>{" "}
                  {booking.status}
                </p>
              )}
              <p>
                <span className="font-medium text-foreground">Total:</span>{" "}
                {formatPrice(booking.price)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`/passes/booking/${booking.id}?auto=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-full border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                Download pass
              </a>
              <ActionButton
                label="Download receipt"
                variant="outline"
                className="rounded-full"
                action="print"
              />
              {cancellable && booking.status === "Upcoming" ? (
                <Button
                  variant="ghost"
                  className="rounded-full text-destructive hover:bg-destructive/10"
                  onClick={() => handleStatus("Cancelled")}
                  disabled={saving}
                >
                  {saving ? "Cancelling…" : "Cancel booking"}
                </Button>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
