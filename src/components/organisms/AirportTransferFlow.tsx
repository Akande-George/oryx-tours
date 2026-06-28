"use client";

import { useMemo, useRef } from "react";
import { MapPin, Plane } from "lucide-react";
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
import type { AirportDirection } from "@/types";

export function AirportTransferFlow() {
  const { vehicles } = useSupabaseCollections(["vehicles"]);
  const {
    travelDate,
    guests,
    pickup,
    dropoff,
    vehicleId,
    airportDirection,
    setTravelDate,
    setGuests,
    setPickup,
    setDropoff,
    setVehicleId,
    setAirportDirection,
  } = useBookingStore();

  const formRef = useRef<HTMLDivElement>(null);
  const selected = vehicles.find((v) => v.id === vehicleId) ?? null;
  const dateValid = travelDate !== "" && travelDate >= todayISO();
  const ready =
    pickup.trim() !== "" &&
    dropoff.trim() !== "" &&
    dateValid &&
    guests >= 1 &&
    !!selected;

  const total = useMemo(
    () => (selected ? selected.transferPrice * Math.max(1, guests) : 0),
    [selected, guests],
  );

  const handleSelectVehicle = (id: string) => {
    setVehicleId(id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isAirportPickup = airportDirection === "pickup";

  const pickupLabel = isAirportPickup
    ? "Airport pickup location"
    : "Pickup location";
  const dropoffLabel = isAirportPickup
    ? "Drop-off location"
    : "Airport drop-off location";
  const pickupPlaceholder = isAirportPickup
    ? "Airport terminal"
    : "Hotel or address";
  const dropoffPlaceholder = isAirportPickup
    ? "Hotel or final destination"
    : "Airport terminal";

  const handleConfirm = () => {
    toast.success(
      "Transfer confirmed",
      selected
        ? `${selected.name} · ${pickup} → ${dropoff} · ${travelDate} · ${formatPrice(total)}`
        : undefined,
    );
  };

  const pickupField = (
    <div className="space-y-2">
      <p className="text-sm font-semibold">
        {pickupLabel} <span className="text-destructive">*</span>
      </p>
      <Input
        placeholder={pickupPlaceholder}
        value={pickup}
        onChange={(event) => setPickup(event.target.value)}
      />
    </div>
  );

  const dropoffField = (
    <div className="space-y-2">
      <p className="text-sm font-semibold">
        {dropoffLabel} <span className="text-destructive">*</span>
      </p>
      <Input
        placeholder={dropoffPlaceholder}
        value={dropoff}
        onChange={(event) => setDropoff(event.target.value)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div
        ref={formRef}
        className="grid scroll-mt-24 gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Airport transfer details</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Transfer direction <span className="text-destructive">*</span>
            </p>
            <Select
              value={airportDirection}
              onValueChange={(value) =>
                setAirportDirection(value as AirportDirection)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Airport pickup</SelectItem>
                <SelectItem value="dropoff">Airport drop-off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {isAirportPickup ? pickupField : dropoffField}
            {isAirportPickup ? dropoffField : pickupField}
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                Transfer date <span className="text-destructive">*</span>
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
                <span>{pickup || pickupLabel}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                <span>{dropoff || dropoffLabel}</span>
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
                  {formatPrice(total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.name} · {selected.fleetCategory} · {guests}{" "}
                  {guests === 1 ? "passenger" : "passengers"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(selected.transferPrice)} per passenger ·{" "}
                  {formatPrice(selected.extraHourPrice)} per extra hour
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
              Confirm transfer
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
