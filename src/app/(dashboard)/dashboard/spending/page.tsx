"use client";

import { useState } from "react";
import { Download, Receipt } from "lucide-react";
import { Badge, Button } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { BookingDetailsDialog } from "@/components/organisms/BookingDetailsDialog";
import { formatPrice, formatDate } from "@/lib/format";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Booking, BookingStatus } from "@/types";

const statusTone: Record<BookingStatus, string> = {
  Upcoming: "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-slate-100 text-slate-700",
};

export default function CustomerSpendingPage() {
  const [selected, setSelected] = useState<Booking | null>(null);
  const { user } = useAuth();
  const { bookings: allBookings } = useSupabaseCollections(["bookings"]);
  const bookings = user
    ? allBookings.filter((b) => b.customerId === user.id)
    : [];

  const completed = bookings.filter((b) => b.status === "Completed");
  const lifetime = completed.reduce((sum, b) => sum + b.price, 0);
  const avgPerTrip =
    completed.length === 0 ? 0 : Math.round(lifetime / completed.length);
  const lastPayment = [...completed].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];

  const sortedBookings = [...bookings].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className="space-y-10">
      <SectionHeading
        title="Spending"
        subtitle="A full record of payments, deposits, and receipts."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Lifetime spend
            </p>
            <p className="text-2xl font-semibold">{formatPrice(lifetime)}</p>
            <p className="text-xs text-muted-foreground">
              From {completed.length} completed trips
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Avg per trip
            </p>
            <p className="text-2xl font-semibold">{formatPrice(avgPerTrip)}</p>
            <p className="text-xs text-muted-foreground">
              Across completed trips
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Last payment
            </p>
            <p className="text-base font-semibold">
              {lastPayment ? formatDate(lastPayment.date) : "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {lastPayment ? formatPrice(lastPayment.price) : "No payments yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Payment history</p>
            <p className="text-xs text-muted-foreground">
              Tap a row to view booking details and download a receipt.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => window.print()}
          >
            <Download className="h-3.5 w-3.5" /> Export all
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBookings.length ? (
                sortedBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelected(booking)}
                  >
                    <TableCell>{formatDate(booking.date)}</TableCell>
                    <TableCell>{booking.tourTitle}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.reference}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-full ${statusTone[booking.status]}`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(booking.price)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-muted-foreground"
                  >
                    <Receipt className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                    No payments yet. Once you book a tour you&apos;ll see it
                    here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <BookingDetailsDialog
        booking={selected}
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
