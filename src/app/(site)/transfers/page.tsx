import Link from "next/link";
import { MapPin } from "lucide-react";
import { Input } from "@/components/atoms";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { VehicleCard } from "@/components/molecules/VehicleCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice, todayISO } from "@/lib/format";
import { mockVehicles } from "@/lib/mock-data";
import type { FleetCategory } from "@/types";

const fleetOrder: FleetCategory[] = ["Economy", "Premium", "VIP"];

export default function TransfersPage() {
  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionHeading
          title="Airport transfers & local fleet"
          subtitle="Executive pickups with concierge-level coordination."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Pickup location" />
              <Input placeholder="Drop-off location" />
              <Input type="date" min={todayISO()} aria-label="Transfer date" />
              <Input
                type="number"
                min={1}
                defaultValue={2}
                placeholder="Passengers"
              />
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Route preview
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span>Pick-up location appears here once entered</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                  <span>Drop-off location appears here once entered</span>
                </div>
              </div>
            </div>
            <Link
              href="/booking?type=airport"
              className={buttonVariants({ className: "w-full rounded-full" })}
            >
              Continue to booking
            </Link>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Fleet
            </p>
            <div className="grid gap-4">
              {mockVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </div>

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
