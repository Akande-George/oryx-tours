"use client";

import { useMemo } from "react";
import { Clock, MapPin } from "lucide-react";
import { Badge, Button, Input } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingStore } from "@/store/booking-store";
import { formatPrice, todayISO } from "@/lib/format";
import { mockVehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { DurationMode, FleetCategory } from "@/types";

const fleetOrder: FleetCategory[] = ["Economy", "Premium", "VIP"];

const durationLabel: Record<DurationMode, string> = {
  "half-day": "Half day (4 hrs)",
  "full-day": "Full day (8 hrs)",
  "extra-hour": "Full day + extra hours",
};

export function LocalTransportFlow() {
  const {
    travelDate,
    guests,
    pickup,
    dropoff,
    vehicleId,
    durationMode,
    extraHours,
    setTravelDate,
    setGuests,
    setPickup,
    setDropoff,
    setVehicleId,
    setDurationMode,
    setExtraHours,
  } = useBookingStore();

  const grouped = useMemo(() => {
    return fleetOrder.map((category) => ({
      category,
      vehicles: mockVehicles.filter((v) => v.fleetCategory === category),
    }));
  }, []);

  const selected = mockVehicles.find((v) => v.id === vehicleId) ?? null;
  const dateValid = travelDate !== "" && travelDate >= todayISO();

  const total = useMemo(() => {
    if (!selected) return 0;
    if (durationMode === "half-day") return selected.halfDayPrice;
    if (durationMode === "full-day") return selected.fullDayPrice;
    return selected.fullDayPrice + Math.max(0, extraHours) * selected.extraHourPrice;
  }, [selected, durationMode, extraHours]);

  const ready =
    pickup.trim() !== "" &&
    dropoff.trim() !== "" &&
    dateValid &&
    guests >= 1 &&
    !!selected;

  const handleConfirm = () => {
    window.alert(
      selected
        ? `Local transport booked: ${selected.name} for ${durationLabel[durationMode]} on ${travelDate} (${formatPrice(total)}).`
        : "Booking confirmed.",
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Local transport details</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Pick-up <span className="text-destructive">*</span>
              </p>
              <Input
                placeholder="Hotel or address"
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Drop-off <span className="text-destructive">*</span>
              </p>
              <Input
                placeholder="Destination or 'Same as pick-up'"
                value={dropoff}
                onChange={(event) => setDropoff(event.target.value)}
              />
            </div>
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
          <div className="space-y-2">
            <p className="text-sm font-semibold">Duration</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(durationLabel) as DurationMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDurationMode(mode)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    durationMode === mode
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white/80 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {durationLabel[mode]}
                </button>
              ))}
            </div>
            {durationMode === "extra-hour" ? (
              <div className="grid gap-2 sm:max-w-xs">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Extra hours
                </p>
                <Input
                  type="number"
                  min={1}
                  value={extraHours}
                  onChange={(event) =>
                    setExtraHours(Number(event.target.value))
                  }
                />
              </div>
            ) : null}
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
              Live total
            </p>
            {selected ? (
              <>
                <p className="text-3xl font-semibold text-primary">
                  {formatPrice(total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.name} · {durationLabel[durationMode]}
                  {durationMode === "extra-hour" && extraHours > 0
                    ? ` (+${extraHours} hr)`
                    : ""}
                </p>
                <div className="space-y-1 pt-2 text-sm text-muted-foreground">
                  <p>Half day: {formatPrice(selected.halfDayPrice)}</p>
                  <p>Full day: {formatPrice(selected.fullDayPrice)}</p>
                  <p>Extra hour: {formatPrice(selected.extraHourPrice)}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a vehicle below to see your live total.
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
                          From {formatPrice(vehicle.halfDayPrice)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {vehicle.capacity} seats · half {formatPrice(vehicle.halfDayPrice)} · full {formatPrice(vehicle.fullDayPrice)}
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
