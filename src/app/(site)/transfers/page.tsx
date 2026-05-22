"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Car,
  Clock,
  MapPin,
  Plane,
  Sun,
  Sunrise,
  Users,
} from "lucide-react";
import { Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import type { FleetCategory } from "@/types";

const fleetOrder: FleetCategory[] = ["Economy", "Premium", "VIP"];

type ServiceMode = "airport" | "half-day" | "full-day";

type ServiceOption = {
  value: ServiceMode;
  label: string;
  blurb: string;
  hours: string;
  icon: React.ComponentType<{ className?: string }>;
  priceKey: "transferPrice" | "halfDayPrice" | "fullDayPrice";
};

const serviceOptions: ServiceOption[] = [
  {
    value: "airport",
    label: "Airport transfer",
    blurb: "One-way pickup or drop-off.",
    hours: "Per ride",
    icon: Plane,
    priceKey: "transferPrice",
  },
  {
    value: "half-day",
    label: "Half-day hire",
    blurb: "4 hours with a private chauffeur.",
    hours: "4 hours",
    icon: Sunrise,
    priceKey: "halfDayPrice",
  },
  {
    value: "full-day",
    label: "Full-day hire",
    blurb: "8 hours, anywhere in town.",
    hours: "8 hours",
    icon: Sun,
    priceKey: "fullDayPrice",
  },
];

export default function TransfersPage() {
  const [service, setService] = useState<ServiceMode>("airport");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);

  const activeOption = useMemo(
    () => serviceOptions.find((option) => option.value === service)!,
    [service],
  );

  const fromPrice = useMemo(() => {
    const cheapest = [...mockVehicles].sort(
      (a, b) => a[activeOption.priceKey] - b[activeOption.priceKey],
    )[0];
    return cheapest ? cheapest[activeOption.priceKey] : 0;
  }, [activeOption]);

  const continueHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("type", service === "airport" ? "airport" : "local");
    if (service !== "airport") params.set("duration", service);
    if (date) params.set("date", date);
    if (pickup) params.set("pickup", pickup);
    if (dropoff) params.set("dropoff", dropoff);
    params.set("passengers", String(passengers));
    return `/booking?${params.toString()}`;
  }, [service, pickup, dropoff, date, passengers]);

  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionHeading
          title="Airport transfers & local fleet"
          subtitle="Executive pickups with concierge-level coordination."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Service type
              </Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {serviceOptions.map((option) => {
                  const Icon = option.icon;
                  const active = service === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setService(option.value)}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
                        active
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {option.blurb}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                        <Clock className="size-3" />
                        {option.hours}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup location</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="pickup"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder={
                      service === "airport"
                        ? "Airport terminal..."
                        : "Hotel, residence, meeting point..."
                    }
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoff">
                  {service === "airport" ? "Drop-off location" : "Primary stop"}
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="dropoff"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder={
                      service === "airport"
                        ? "Hotel, residence, meeting point..."
                        : "Where you'll spend most of the day"
                    }
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferDate">Date</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="transferDate"
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-9"
                    aria-label="Transfer date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="passengers"
                    type="number"
                    min={1}
                    max={20}
                    value={passengers}
                    onChange={(e) =>
                      setPassengers(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] p-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Car className="size-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Quote estimate
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeOption.label}
                </p>
              </div>
              <p className="mt-2 font-heading text-2xl font-semibold">
                From {formatPrice(fromPrice)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Final price varies by vehicle and route. You can pick the exact
                vehicle on the next step.
              </p>
            </div>

            <Link
              href={continueHref}
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
