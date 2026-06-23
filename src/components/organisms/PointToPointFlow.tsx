"use client";

import { useMemo } from "react";
import { MapPin, Plus, Route, X } from "lucide-react";
import { Button, DateInput, Input } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FleetBrowser } from "@/components/organisms/FleetBrowser";
import { toast } from "@/components/molecules/Toaster";
import { useBookingStore } from "@/store/booking-store";
import { formatPrice, todayISO } from "@/lib/format";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";

const MAX_STOPS = 6;

export function PointToPointFlow() {
  const { vehicles } = useSupabaseCollections(["vehicles"]);
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
    addStop,
    removeStop,
  } = useBookingStore();

  const selected = vehicles.find((v) => v.id === vehicleId) ?? null;
  const dateValid = travelDate !== "" && travelDate >= todayISO();

  const activeStops = stops.filter((stop) => stop.trim() !== "");
  const stopCount = Math.max(activeStops.length, 1);

  const total = useMemo(() => {
    if (!selected) return 0;
    const perLeg = selected.pointToPointPrice || selected.transferPrice;
    return perLeg * stopCount;
  }, [selected, stopCount]);

  const ready =
    pickup.trim() !== "" &&
    activeStops.length >= 1 &&
    dateValid &&
    guests >= 1 &&
    !!selected;

  const handleConfirm = () => {
    if (!selected) {
      toast.success("Booking confirmed");
      return;
    }
    const route = [pickup, ...activeStops].join(" → ");
    toast.success(
      "Point-to-point booked",
      `${selected.name} · ${travelDate} · ${formatPrice(total)} · ${route}`,
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
              Drop-off stops <span className="text-destructive">*</span>
            </p>
            <div className="space-y-2">
              {stops.map((value, index) => {
                const isFirst = index === 0;
                const canRemove = stops.length > 1;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">
                        Stop {index + 1}
                        {isFirst ? (
                          <span className="text-destructive"> *</span>
                        ) : (
                          <span className="text-muted-foreground/70">
                            {" "}
                            (optional)
                          </span>
                        )}
                      </p>
                      <Input
                        value={value}
                        onChange={(e) => setStop(index, e.target.value)}
                        placeholder={
                          isFirst
                            ? "Drop-off address or landmark"
                            : `Stop ${index + 1} address`
                        }
                      />
                    </div>
                    {canRemove ? (
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        aria-label={`Remove stop ${index + 1}`}
                        className="mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white/80 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addStop}
              disabled={stops.length >= MAX_STOPS}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Add stop
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Service date <span className="text-destructive">*</span>
              </p>
              <DateInput
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
            <p className="text-sm font-semibold">
              Fleet vehicle <span className="text-destructive">*</span>
            </p>
            <Select
              value={vehicleId ?? ""}
              onValueChange={(value) => setVehicleId(value || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a vehicle for your estimate">
                  {selected
                    ? `${selected.name} — ${selected.fleetCategory} · ${selected.capacity} seats`
                    : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} — {vehicle.fleetCategory} ·{" "}
                    {vehicle.capacity} seats
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {stops.map((value, index) => {
                if (!value && index > 0) return null;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                    <span>{value || `Stop ${index + 1}`}</span>
                  </div>
                );
              })}
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
                  {formatPrice(total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.name} · {stopCount}{" "}
                  {stopCount === 1 ? "stop" : "stops"} ·{" "}
                  {formatPrice(
                    selected.pointToPointPrice || selected.transferPrice,
                  )}{" "}
                  per leg
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

      <FleetBrowser
        vehicles={vehicles}
        selectedVehicleId={vehicleId}
        onSelect={setVehicleId}
      />
    </div>
  );
}
