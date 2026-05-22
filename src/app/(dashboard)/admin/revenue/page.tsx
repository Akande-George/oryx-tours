import { TrendingUp } from "lucide-react";
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
import { mockBookings, mockOperators, mockTours } from "@/lib/mock-data";
import { RouteGuard } from "@/components/providers/RouteGuard";

const monthly: { label: string; value: number }[] = [
  { label: "Jan", value: 18400 },
  { label: "Feb", value: 22100 },
  { label: "Mar", value: 27500 },
  { label: "Apr", value: 24800 },
  { label: "May", value: 31200 },
  { label: "Jun", value: 35900 },
];

export default function AdminRevenuePage() {
  const activeBookings = mockBookings.filter((b) => b.status !== "Cancelled");
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.price, 0);
  const avgBookingValue =
    activeBookings.length === 0
      ? 0
      : Math.round(totalRevenue / activeBookings.length);
  const peakMonth = monthly.reduce((best, m) =>
    m.value > best.value ? m : best,
  );

  const byCategory = mockTours.reduce<Record<string, number>>((acc, tour) => {
    acc[tour.category] = (acc[tour.category] ?? 0) + tour.priceFrom;
    return acc;
  }, {});
  const categoryRows = Object.entries(byCategory)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  const byOperator = mockOperators
    .map((operator) => {
      const operatorTours = mockTours.filter(
        (t) => t.operatorId === operator.id,
      );
      const revenue = operatorTours.reduce((sum, t) => sum + t.priceFrom, 0);
      return {
        name: operator.name,
        tours: operatorTours.length,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const maxMonthly = Math.max(...monthly.map((m) => m.value));

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Revenue"
          subtitle="Financial signal across categories, operators, and months."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-1 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Total revenue
              </p>
              <p className="text-2xl font-semibold">{formatPrice(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Active bookings</p>
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
                Peak month
              </p>
              <p className="text-2xl font-semibold">{peakMonth.label}</p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(peakMonth.value)}
              </p>
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

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Last 6 months</p>
              <p className="text-xs text-muted-foreground">
                Synthetic — to be wired to live data.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5" /> Trending up
            </span>
          </div>
          <div className="grid grid-cols-6 items-end gap-3 pt-2">
            {monthly.map((m) => {
              const heightPct = (m.value / maxMonthly) * 100;
              return (
                <div key={m.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-b from-primary to-primary/40"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatPrice(m.value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <p className="text-sm font-semibold">Catalog value by category</p>
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
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <p className="text-sm font-semibold">Operator performance</p>
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
    </RouteGuard>
  );
}
