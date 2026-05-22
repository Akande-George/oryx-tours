"use client";

import { Button, Input } from "@/components/atoms";
import { Textarea } from "@/components/ui/textarea";
import { ProgressSteps } from "@/components/organisms/ProgressSteps";
import { useBookingStore } from "@/store/booking-store";
import { formatDate, todayISO } from "@/lib/format";

const steps = ["Select dates", "Traveler details", "Review booking"];

type BookingFlowProps = {
  tourTitle?: string;
  tourLocation?: string;
  priceFrom?: string;
};

export function BookingFlow({
  tourTitle,
  tourLocation,
  priceFrom,
}: BookingFlowProps) {
  const {
    step,
    travelDate,
    guests,
    pickup,
    dropoff,
    notes,
    setTravelDate,
    setGuests,
    setPickup,
    setDropoff,
    setNotes,
    nextStep,
    previousStep,
  } = useBookingStore();

  const handleSaveDraft = () => {
    window.alert("Draft saved to your travel lounge.");
  };

  const dateValid = travelDate !== "" && travelDate >= todayISO();
  const guestsValid = guests >= 1;
  const locationValid = pickup.trim() !== "" && dropoff.trim() !== "";

  const canAdvance =
    (step === 1 && dateValid && guestsValid) ||
    (step === 2 && locationValid) ||
    step === 3;

  return (
    <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur">
      <ProgressSteps steps={steps} current={step} />
      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Select travel date <span className="text-destructive">*</span>
            </p>
            <Input
              type="date"
              min={todayISO()}
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
            />
            {!dateValid ? (
              <p className="text-xs text-destructive">
                Pick a departure date in the future.
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Guests <span className="text-destructive">*</span>
            </p>
            <Input
              type="number"
              min={1}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
            />
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Lead traveler</p>
            <Input placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Contact email</p>
            <Input type="email" placeholder="name@email.com" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Pick-up location <span className="text-destructive">*</span>
            </p>
            <Input
              placeholder="Hotel, airport, or address"
              value={pickup}
              onChange={(event) => setPickup(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Drop-off location <span className="text-destructive">*</span>
            </p>
            <Input
              placeholder="Final destination"
              value={dropoff}
              onChange={(event) => setDropoff(event.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className="text-sm font-semibold">Special requests</p>
            <Textarea
              placeholder="Dietary needs, room preferences, or celebration notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Review your itinerary details and confirm your booking with a 30%
            deposit. A dedicated concierge will follow up within 1 hour.
          </p>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="font-semibold text-foreground">Booking summary</p>
            {tourTitle ? (
              <p>
                Tour: {tourTitle}
                {tourLocation ? ` · ${tourLocation}` : ""}
              </p>
            ) : null}
            {priceFrom ? <p>From: {priceFrom}</p> : null}
            <p>
              Departure: {travelDate ? formatDate(travelDate) : "Not selected"}
            </p>
            <p>Guests: {guests}</p>
            <p>Pick-up: {pickup || "Not specified"}</p>
            <p>Drop-off: {dropoff || "Not specified"}</p>
            <p>Notes: {notes || "None"}</p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={previousStep} disabled={step === 1}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSaveDraft}>
            Save as draft
          </Button>
          <Button onClick={nextStep} disabled={!canAdvance}>
            {step === 3 ? "Confirm booking" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
