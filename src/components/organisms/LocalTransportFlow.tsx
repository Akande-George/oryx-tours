"use client";

import { useRef } from "react";
import { Clock, MapPin } from "lucide-react";
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
import type { DurationMode } from "@/types";

type DayHireDuration = Extract<DurationMode, "half-day" | "full-day">;

const durationLabel: Record<DayHireDuration, string> = {
  "half-day": "Half Day",
  "full-day": "Full Day",
};

export function LocalTransportFlow() {
  const { vehicles } = useSupabaseCollections(["vehicles"]);
  const {
    travelDate,
    guests,
    pickup,
    dropoff,
    vehicleId,
    durationMode,
    setTravelDate,
    setGuests,
    setPickup,
    setDropoff,
    setVehicleId,
    setDurationMode,
  } = useBookingStore();

  const dayHireMode: DayHireDuration =
    durationMode === "half-day" ? "half-day" : "full-day";

  const formRef = useRef<HTMLDivElement>(null);
  const selected = vehicles.find((v) => v.id === vehicleId) ?? null;
  const dateValid = travelDate !== "" && travelDate >= todayISO();

  const baseRate = selected
    ? dayHireMode === "half-day"
      ? selected.halfDayPrice
      : selected.fullDayPrice
    : 0;

  const total = baseRate * Math.max(1, guests);

  const handleSelectVehicle = (id: string) => {
    setVehicleId(id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ready =
    pickup.trim() !== "" &&
    dropoff.trim() !== "" &&
    dateValid &&
    guests >= 1 &&
    !!selected;

  const handleConfirm = () => {
    toast.success(
      "Day hire booked",
      selected
        ? `${selected.name} · ${durationLabel[dayHireMode]} · ${travelDate} · ${formatPrice(total)}`
        : undefined,
    );
  };

  return (
    <div className="space-y-6">
      <div
        ref={formRef}
        className="grid scroll-mt-24 gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Day hire details</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Duration <span className="text-destructive">*</span>
            </p>
            <Select
              value={dayHireMode}
              onValueChange={(value) =>
                setDurationMode(value as DayHireDuration)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-day">
                  {durationLabel["full-day"]}
                </SelectItem>
                <SelectItem value="half-day">
                  {durationLabel["half-day"]}
                </SelectItem>
              </SelectContent>
            </Select>
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
                    ? `${selected.name} - ${selected.fleetCategory} · ${selected.capacity} seats`
                    : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.fleetCategory} ·{" "}
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
                  {selected.name} · {durationLabel[dayHireMode]} · {guests}{" "}
                  {guests === 1 ? "passenger" : "passengers"}
                </p>
                <div className="space-y-1 pt-2 text-sm text-muted-foreground">
                  <p>Half day: {formatPrice(selected.halfDayPrice)}</p>
                  <p>Full day: {formatPrice(selected.fullDayPrice)}</p>
                  <p>Extra hour: {formatPrice(selected.extraHourPrice)}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a vehicle above to see your live total.
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
        onSelect={handleSelectVehicle}
      />
    </div>
  );
}
