"use client";

import { Button, Input } from "@/components/atoms";
import { Textarea } from "@/components/ui/textarea";
import { ProgressSteps } from "@/components/organisms/ProgressSteps";
import { useBookingStore } from "@/store/booking-store";

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
    notes,
    setTravelDate,
    setGuests,
    setNotes,
    nextStep,
    previousStep,
  } = useBookingStore();

  const handleSaveDraft = () => {
    window.alert("Draft saved to your travel lounge.");
  };

  return (
    <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur">
      <ProgressSteps steps={steps} current={step} />
      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Select travel dates</p>
            <Input
              type="date"
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
            />
            {!travelDate ? (
              <p className="text-xs text-destructive">
                Please select a preferred departure date.
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Guests</p>
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
            <Input placeholder="name@email.com" />
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
            <p>Departure: {travelDate || "TBD"}</p>
            <p>Guests: {guests}</p>
            <p>Notes: {notes || "None"}</p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSaveDraft}>
            Save as draft
          </Button>
          <Button onClick={nextStep}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
