import type { FleetCategory } from "@/types";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingHub } from "@/components/organisms/BookingHub";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { mockVehicles } from "@/lib/mock-data";

const fleetOrder: FleetCategory[] = ["Economy", "Premium", "VIP"];

export default function TransfersPage() {
  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionHeading
          title="Airport transfers & local fleet"
          subtitle="Executive pickups with concierge-level coordination."
        />

        <BookingHub initialType="airport" />

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold">Fleet pricing</h2>
              <p className="text-sm text-muted-foreground">
                Transparent rate card across every category.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">All prices in USD.</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Half day</TableHead>
                  <TableHead>Full day</TableHead>
                  <TableHead>Extra hour</TableHead>
                  <TableHead>Airport transfer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fleetOrder.flatMap((category) =>
                  mockVehicles
                    .filter((vehicle) => vehicle.fleetCategory === category)
                    .map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">
                          {vehicle.name}
                        </TableCell>
                        <TableCell>{vehicle.fleetCategory}</TableCell>
                        <TableCell>{formatPrice(vehicle.halfDayPrice)}</TableCell>
                        <TableCell>{formatPrice(vehicle.fullDayPrice)}</TableCell>
                        <TableCell>{formatPrice(vehicle.extraHourPrice)}</TableCell>
                        <TableCell>{formatPrice(vehicle.transferPrice)}</TableCell>
                      </TableRow>
                    )),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
}
