import Link from "next/link";
import { Input } from "@/components/atoms";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { VehicleCard } from "@/components/molecules/VehicleCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockVehicles } from "@/lib/mock-data";

export default function TransfersPage() {
  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionHeading
          title="Airport transfers"
          subtitle="Executive pickups with concierge-level coordination."
        />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Pickup location" />
              <Input placeholder="Drop-off location" />
              <Input type="date" />
              <Select defaultValue="2">
                <SelectTrigger>
                  <SelectValue placeholder="Passengers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 passenger</SelectItem>
                  <SelectItem value="2">2 passengers</SelectItem>
                  <SelectItem value="4">4 passengers</SelectItem>
                  <SelectItem value="6">6 passengers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
              Map preview placeholder
            </div>
            <Link
              href="/booking"
              className={buttonVariants({ className: "w-full rounded-full" })}
            >
              Check availability
            </Link>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Vehicles
            </p>
            <div className="grid gap-4">
              {mockVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
