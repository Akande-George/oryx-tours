"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge, Input } from "@/components/atoms";
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
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatPrice } from "@/lib/format";
import { mockBookings, mockTours } from "@/lib/mock-data";
import type { BookingStatus } from "@/types";

const statusBadge: Record<BookingStatus, string> = {
  Upcoming: "bg-emerald-100 text-emerald-800",
  Completed: "bg-sky-100 text-sky-800",
  Cancelled: "bg-rose-100 text-rose-700",
};

export default function PartnerBookingsPage() {
  const { user } = useAuth();
  const operatorId = user?.operatorId ?? "";
  const [query, setQuery] = useState("");

  const partnerTourIds = useMemo(
    () =>
      new Set(
        mockTours
          .filter((tour) => tour.operatorId === operatorId)
          .map((tour) => tour.id),
      ),
    [operatorId],
  );

  const bookings = useMemo(
    () =>
      mockBookings.filter((booking) => partnerTourIds.has(booking.tourId)),
    [partnerTourIds],
  );

  const filtered = useMemo(
    () =>
      bookings.filter((booking) => {
        if (!query) return true;
        const lc = query.toLowerCase();
        return (
          booking.reference.toLowerCase().includes(lc) ||
          booking.tourTitle.toLowerCase().includes(lc)
        );
      }),
    [bookings, query],
  );

  const counts = useMemo(
    () => ({
      total: bookings.length,
      upcoming: bookings.filter((b) => b.status === "Upcoming").length,
      revenue: bookings
        .filter((b) => b.status !== "Cancelled")
        .reduce((sum, b) => sum + b.price, 0),
    }),
    [bookings],
  );

  return (
    <RouteGuard allow={["partner"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Your bookings"
          subtitle="Bookings scoped to tours you operate."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label="Total bookings" value={String(counts.total)} />
          <Stat label="Upcoming" value={String(counts.upcoming)} />
          <Stat label="Revenue" value={formatPrice(counts.revenue)} />
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reference or tour name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.reference}
                      </TableCell>
                      <TableCell>{booking.tourTitle}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full ${statusBadge[booking.status]}`}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(booking.price)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No bookings for your tours yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
      <CardContent className="space-y-1 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
