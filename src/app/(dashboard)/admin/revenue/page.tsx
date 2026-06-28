"use client";

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
import { formatPrice } from "@/lib/format";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";

export default function AdminRevenuePage() {
  const { bookings, operators, tours, vehicles } = useSupabaseCollections([
    "bookings",
    "operators",
    "tours",
    "vehicles",
  ]);
  const activeBookings = bookings.filter((b) => b.status !== "Cancelled");
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.price, 0);
  const avgBookingValue =
    activeBookings.length === 0
      ? 0
      : Math.round(totalRevenue / activeBookings.length);

  const toursCatalogValue = tours.reduce((sum, t) => sum + t.priceFrom, 0);
  const fleetCatalogValue = vehicles.reduce((sum, v) => sum + v.priceFrom, 0);

  const byCategory = tours.reduce<Record<string, number>>((acc, tour) => {
    acc[tour.category] = (acc[tour.category] ?? 0) + tour.priceFrom;
    return acc;
  }, {});
  const categoryRows = Object.entries(byCategory)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  const byFleetCategory = vehicles.reduce<Record<string, number>>(
    (acc, vehicle) => {
      acc[vehicle.fleetCategory] =
        (acc[vehicle.fleetCategory] ?? 0) + vehicle.priceFrom;
      return acc;
    },
    {},
  );
  const fleetRows = Object.entries(byFleetCategory)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  const byOperator = operators
    .map((operator) => {
      const operatorTours = tours.filter((t) => t.operatorId === operator.id);
      const revenue = operatorTours.reduce((sum, t) => sum + t.priceFrom, 0);
      return {
        name: operator.name,
        tours: operatorTours.length,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Revenue"
          subtitle="Financial signal across tours, fleet, categories, and operators."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Total revenue
              </p>
              <p className="text-2xl font-semibold">
                {formatPrice(totalRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Tours catalog value
              </p>
              <p className="text-2xl font-semibold">
                {formatPrice(toursCatalogValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Across {tours.length} tours
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Fleet catalog value
              </p>
              <p className="text-2xl font-semibold">
                {formatPrice(fleetCatalogValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Across {vehicles.length} vehicles
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Avg booking value
              </p>
              <p className="text-2xl font-semibold">
                {formatPrice(avgBookingValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Across {activeBookings.length} bookings
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Active bookings
              </p>
              <p className="text-2xl font-semibold">{activeBookings.length}</p>
              <p className="text-xs text-muted-foreground">Non-cancelled</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Top operator
              </p>
              <p className="text-base font-semibold">{byOperator[0]?.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(byOperator[0]?.revenue ?? 0)} catalog value
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <p className="text-sm font-semibold">Catalog value by category</p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryRows.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(row.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <p className="text-sm font-semibold">
              Fleet catalog value by category
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fleet category</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fleetRows.length ? (
                    fleetRows.map((row) => (
                      <TableRow key={row.category}>
                        <TableCell>{row.category}</TableCell>
                        <TableCell className="text-right">
                          {formatPrice(row.value)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground"
                      >
                        No vehicles in the fleet yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <p className="text-sm font-semibold">Operator performance</p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operator</TableHead>
                    <TableHead>Tours</TableHead>
                    <TableHead className="text-right">Catalog value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byOperator.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.tours}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(row.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
