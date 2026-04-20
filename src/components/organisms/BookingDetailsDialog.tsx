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

type BookingDetailsDialogProps = {
  triggerLabel?: string;
};

export function BookingDetailsDialog({
  triggerLabel = "View booking details",
}: BookingDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="rounded-full" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Royal Dune Retreat</DialogTitle>
            <DialogDescription>
              Booking ref ORYX-1024 · June 18, 2026
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Guests: 2</p>
            <p>Suite: Private dune villa</p>
            <p>Concierge: Assigned</p>
          </div>
          <ActionButton
            label="Download receipt"
            variant="outline"
            className="rounded-full"
            action="print"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
