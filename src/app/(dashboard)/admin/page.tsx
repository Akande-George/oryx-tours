import { Badge } from "@/components/atoms";
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
import { mockBookings, mockTours } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="Admin command center"
        subtitle="Oversight across inventory, partner approvals, and bookings."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Revenue
            </p>
            <p className="text-2xl font-semibold">{formatPrice(128420)}</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Pending approvals
            </p>
            <p className="text-2xl font-semibold">14</p>
            <p className="text-sm text-muted-foreground">Tours & operators</p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Active bookings
            </p>
            <p className="text-2xl font-semibold">286</p>
            <p className="text-sm text-muted-foreground">Across 12 regions</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Tour approvals</p>
          <Badge className="rounded-full">Needs review</Badge>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTours.slice(0, 4).map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>{tour.title}</TableCell>
                  <TableCell>{tour.category}</TableCell>
                  <TableCell>Pending review</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      Awaiting
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <p className="text-sm font-semibold">Recent bookings</p>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.reference}</TableCell>
                    <TableCell>{booking.tourTitle}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>{formatPrice(booking.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 text-sm text-muted-foreground shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            System status
          </p>
          <div className="flex items-center justify-between">
            <span>Fraud monitoring</span>
            <Badge className="rounded-full bg-emerald-100 text-emerald-800">
              Healthy
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Payments</span>
            <Badge className="rounded-full bg-emerald-100 text-emerald-800">
              Operational
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Partner onboarding</span>
            <Badge className="rounded-full bg-amber-100 text-amber-800">
              Backlog
            </Badge>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm font-semibold text-foreground">
              Action queue
            </p>
            <p className="mt-2">
              Review 6 partner submissions and verify 3 high-value bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
