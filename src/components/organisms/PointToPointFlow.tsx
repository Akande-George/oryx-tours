"use client";

import { useMemo } from "react";
import { MapPin, Route } from "lucide-react";
import { Badge, Button, Input } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingStore } from "@/store/booking-store";
import { formatPrice, todayISO } from "@/lib/format";
import { mockVehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { FleetCategory } from "@/types";

const fleetOrder: FleetCategory[] = ["Economy", "Premium", "VIP"];

const stopLabels = ["Point 1", "Point 2", "Point 3"] as const;

const locationOptions = [
  "Hamad International Airport",
  "Doha Corniche",
  "Souq Waqif",
  "The Pearl-Qatar",
  "Katara Cultural Village",
  "Msheireb Downtown Doha",
  "Lusail City",
  "Education City",
  "Aspire Park",
  "Doha Festival City",
  "Villaggio Mall",
  "Mall of Qatar",
  "Sheraton Doha",
  "Four Seasons Doha",
  "St Regis Doha",
  "Banana Island Resort",
  "Khor Al Adaid (Inland Sea)",
] as const;

export function PointToPointFlow() {
  const {
    travelDate,
    guests,
    pickup,
    vehicleId,
    stops,
    setTravelDate,
    setGuests,
    setPickup,
    setVehicleId,
    setStop,
  } = useBookingStore();

  const grouped = useMemo(() => {
    return fleetOrder.map((category) => ({
      category,
      vehicles: mockVehicles.filter((v) => v.fleetCategory === category),
    }));
  }, []);

  const selected = mockVehicles.find((v) => v.id === vehicleId) ?? null;
  const dateValid = travelDate !== "" && travelDate >= todayISO();

  const activeStops = stops.filter((stop) => stop.trim() !== "");
  const stopCount = Math.max(activeStops.length, 1);

  const total = useMemo(() => {
    if (!selected) return 0;
    return selected.transferPrice * stopCount;
  }, [selected, stopCount]);

  const ready =
    pickup.trim() !== "" &&
    activeStops.length >= 1 &&
    dateValid &&
    guests >= 1 &&
    !!selected;

  const handleConfirm = () => {
    if (!selected) {
      window.alert("Booking confirmed.");
      return;
    }
    const route = [pickup, ...activeStops].join(" → ");
    window.alert(
      `Point-to-point booked: ${selected.name} on ${travelDate} (${formatPrice(total)}).\nRoute: ${route}`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Point-to-point details</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Pick-up location <span className="text-destructive">*</span>
            </p>
            <Input
              placeholder="Hotel or address"
              value={pickup}
              onChange={(event) => setPickup(event.target.value)}
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">
              Drop-off points <span className="text-destructive">*</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {stopLabels.map((label, index) => (
                <div key={label} className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    {label}
                    {index === 0 ? (
                      <span className="text-destructive"> *</span>
                    ) : (
                      <span className="text-muted-foreground/70">
                        {" "}
                        (optional)
                      </span>
                    )}
                  </p>
                  <Select
                    value={stops[index] || ""}
                    onValueChange={(value) =>
                      setStop(index as 0 | 1 | 2, value ?? "")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Service date <span className="text-destructive">*</span>
              </p>
              <Input
                type="date"
                min={todayISO()}
                value={travelDate}
                onChange={(event) => setTravelDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Passengers <span className="text-destructive">*</span>
              </p>
              <Input
                type="number"
                min={1}
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
              />
            </div>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/70 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Route preview
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{pickup || "Pick-up location"}</span>
              </div>
              {stopLabels.map((label, index) => {
                const value = stops[index];
                if (!value && index > 0) return null;
                return (
                  <div key={label} className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                    <span>{value || label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <CardContent className="space-y-3 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Choose vehicle
              </p>
              <Select
                value={vehicleId ?? ""}
                onValueChange={(value) => setVehicleId(value || null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a vehicle for your estimate" />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} — {vehicle.fleetCategory} ·{" "}
                      {vehicle.capacity} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Estimated fare
            </p>
            {selected ? (
              <>
                <p className="text-3xl font-semibold text-primary">
                  {formatPrice(total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.name} · {stopCount}{" "}
                  {stopCount === 1 ? "stop" : "stops"} ·{" "}
                  {formatPrice(selected.transferPrice)} per leg
                </p>
                <ul className="space-y-1 pt-2 text-sm text-muted-foreground">
                  {selected.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a vehicle above to see your instant fare.
              </p>
            )}
            <Button
              className="mt-2 w-full rounded-full"
              onClick={handleConfirm}
              disabled={!ready}
            >
              Confirm booking
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Browse the fleet
        </h3>
        <div className="space-y-6">
          {grouped.map(({ category, vehicles }) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{category}</h4>
                <Badge variant="secondary" className="rounded-full text-xs">
                  {vehicles.length} options
                </Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {vehicles.map((vehicle) => {
                  const active = vehicle.id === vehicleId;
                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => setVehicleId(vehicle.id)}
                      className={cn(
                        "rounded-2xl border bg-white/80 p-4 text-left shadow-[0_16px_36px_-28px_rgba(92,70,39,0.35)] transition-all",
                        active
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-white/60 hover:-translate-y-0.5",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{vehicle.name}</p>
                        <p className="font-semibold text-primary">
                          {formatPrice(vehicle.transferPrice)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {vehicle.capacity} seats · {vehicle.luggage}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
