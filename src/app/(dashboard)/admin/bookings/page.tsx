"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsDialog } from "@/components/organisms/BookingDetailsDialog";
import { formatPrice, formatCompactDate } from "@/lib/format";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import type { Booking, BookingStatus } from "@/types";

const tabs: { value: "all" | Lowercase<BookingStatus>; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusStyles: Record<BookingStatus, string> = {
  Upcoming: "bg-emerald-100 text-emerald-800",
  Completed: "bg-slate-100 text-slate-800",
  Cancelled: "bg-rose-100 text-rose-700",
};

export default function AdminBookingsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const { bookings } = useSupabaseCollections();

  const totalValue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.price, 0);
  const stats = {
    upcoming: bookings.filter((b) => b.status === "Upcoming").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
    cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  const filterByQuery = (rows: Booking[]) =>
    query
      ? rows.filter(
          (b) =>
            b.tourTitle.toLowerCase().includes(query.toLowerCase()) ||
            b.reference.toLowerCase().includes(query.toLowerCase()),
        )
      : rows;

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Bookings"
          subtitle="Every booking across every operator, with status filters."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Total value
              </p>
              <p className="text-2xl font-semibold">
                {formatPrice(totalValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Excludes cancelled
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Upcoming
              </p>
              <p className="text-2xl font-semibold">{stats.upcoming}</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Completed
              </p>
              <p className="text-2xl font-semibold">{stats.completed}</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Cancelled
              </p>
              <p className="text-2xl font-semibold">{stats.cancelled}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by tour title or reference"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => {
              const rows =
                tab.value === "all"
                  ? bookings
                  : bookings.filter(
                      (b) => b.status.toLowerCase() === tab.value,
                    );
              const filtered = filterByQuery(rows);

              return (
                <TabsContent key={tab.value} value={tab.value} className="pt-4">
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
                            <TableRow
                              key={booking.id}
                              className="cursor-pointer hover:bg-muted/40"
                              onClick={() => setSelected(booking)}
                            >
                              <TableCell className="font-medium">
                                {booking.reference}
                              </TableCell>
                              <TableCell>{booking.tourTitle}</TableCell>
                              <TableCell>
                                {formatCompactDate(booking.date)}
                              </TableCell>
                              <TableCell>{booking.guests}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`rounded-full ${statusStyles[booking.status]}`}
                                >
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatPrice(booking.price)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-sm text-muted-foreground"
                            >
                              No bookings match this filter.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        <BookingDetailsDialog
          booking={selected}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        />
      </div>
    </RouteGuard>
  );
}
