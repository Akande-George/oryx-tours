import { ActionButton, Input } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { mockTours } from "@/lib/mock-data";
import { RouteGuard } from "@/components/providers/RouteGuard";

export default function PartnerDashboardPage() {
  return (
    <RouteGuard allow={["partner", "admin"]}>
    <div className="space-y-8">
      <SectionHeading
        title="Partner operator dashboard"
        subtitle="Manage tours, bookings, and revenue insights."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Earnings
          </p>
          <p className="text-2xl font-semibold">$48,720</p>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Bookings
          </p>
          <p className="text-2xl font-semibold">128</p>
          <p className="text-sm text-muted-foreground">Confirmed this month</p>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Tour rating
          </p>
          <p className="text-2xl font-semibold">4.8</p>
          <p className="text-sm text-muted-foreground">
            Average guest feedback
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold">Manage tours</p>
          <div className="flex gap-2">
            <Input placeholder="Search tours" className="w-[200px]" />
            <ActionButton
              label="Filters"
              variant="outline"
              className="rounded-full"
              message="Filters panel will open here."
            />
          </div>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTours.slice(0, 4).map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>{tour.title}</TableCell>
                  <TableCell>{tour.category}</TableCell>
                  <TableCell>{tour.durationDays} days</TableCell>
                  <TableCell>Published</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
        <p className="text-sm font-semibold">Add or edit tour</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input placeholder="Tour name" />
          <Input placeholder="Location" />
          <Input placeholder="Duration" />
          <Input placeholder="Base price" />
          <Textarea
            placeholder="Highlights"
            className="md:col-span-2 min-h-[120px]"
          />
          <div className="md:col-span-2 flex justify-end">
            <ActionButton
              label="Save tour"
              className="rounded-full"
              message="Tour saved successfully."
            />
          </div>
        </div>
      </div>
    </div>
    </RouteGuard>
  );
}
