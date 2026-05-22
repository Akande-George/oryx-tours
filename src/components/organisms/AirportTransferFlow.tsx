"use client";

import { useMemo } from "react";
import { MapPin, Plane } from "lucide-react";
import { Badge, Button, Input } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingStore } from "@/store/booking-store";
import { formatPrice, todayISO } from "@/lib/format";
import { mockVehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { FleetCategory } from "@/types";

const fleetOrder: FleetCategory[] = ["Economy", "Premium", "VIP"];

export function AirportTransferFlow() {
  const {
    travelDate,
    guests,
    pickup,
    dropoff,
    vehicleId,
    setTravelDate,
    setGuests,
    setPickup,
    setDropoff,
    setVehicleId,
  } = useBookingStore();

  const grouped = useMemo(() => {
    return fleetOrder.map((category) => ({
      category,
      vehicles: mockVehicles.filter((v) => v.fleetCategory === category),
    }));
  }, []);

  const selected = mockVehicles.find((v) => v.id === vehicleId) ?? null;
  const dateValid = travelDate !== "" && travelDate >= todayISO();
  const ready =
    pickup.trim() !== "" &&
    dropoff.trim() !== "" &&
    dateValid &&
    guests >= 1 &&
    !!selected;

  const handleConfirm = () => {
    window.alert(
      selected
        ? `Transfer confirmed: ${selected.name} from ${pickup} to ${dropoff} on ${travelDate} (${formatPrice(selected.transferPrice)}).`
        : "Transfer confirmed.",
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Airport transfer details</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Pick-up <span className="text-destructive">*</span>
              </p>
              <Input
                placeholder="Airport terminal or address"
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Drop-off <span className="text-destructive">*</span>
              </p>
              <Input
                placeholder="Hotel or final destination"
                value={dropoff}
                onChange={(event) => setDropoff(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Transfer date <span className="text-destructive">*</span>
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
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                <span>{dropoff || "Drop-off location"}</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Estimated fare
            </p>
            {selected ? (
              <>
                <p className="text-3xl font-semibold text-primary">
                  {formatPrice(selected.transferPrice)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.name} · {selected.fleetCategory} ·{" "}
                  {selected.capacity} passengers
                </p>
                <ul className="space-y-1 pt-2 text-sm text-muted-foreground">
                  {selected.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a vehicle below to see your instant fare.
              </p>
            )}
            <Button
              className="mt-2 w-full rounded-full"
              onClick={handleConfirm}
              disabled={!ready}
            >
              Confirm transfer
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Choose your vehicle
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
