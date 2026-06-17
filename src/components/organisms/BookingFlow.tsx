"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DateInput, Input } from "@/components/atoms";
import { Textarea } from "@/components/ui/textarea";
import { ProgressSteps } from "@/components/organisms/ProgressSteps";
import { useBookingStore } from "@/store/booking-store";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDate, formatPrice, todayISO } from "@/lib/format";
import type { Tour } from "@/types";

const steps = ["Select dates", "Traveler details", "Review booking"];

type BookingFlowProps = {
  tour: Tour;
};

export function BookingFlow({ tour }: BookingFlowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
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
    reset,
  } = useBookingStore();

  const dateValid = travelDate !== "" && travelDate >= todayISO();
  const guestsValid = guests >= 1;
  const locationValid = pickup.trim() !== "" && dropoff.trim() !== "";

  const canAdvance =
    (step === 1 && dateValid && guestsValid) ||
    (step === 2 && locationValid) ||
    step === 3;

  const totalPrice = tour.priceFrom * guests;

  const handleConfirm = async () => {
    if (!user) {
      router.push(
        `/sign-in?redirect=${encodeURIComponent(`/booking?tour=${tour.slug}`)}`,
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/payments/myfatoorah/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          date: travelDate,
          guests,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.paymentUrl) {
        throw new Error(json.error ?? "Could not start payment");
      }
      reset();
      window.location.href = json.paymentUrl;
    } catch (e) {
      window.alert((e as Error).message);
      setSubmitting(false);
    }
  };

  const handlePrimary = () => {
    if (step === 3) {
      void handleConfirm();
    } else {
      nextStep();
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur">
      <ProgressSteps steps={steps} current={step} />
      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Select travel date <span className="text-destructive">*</span>
            </p>
            <DateInput
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
          <p>Review your itinerary details before confirming.</p>
          <div className="space-y-1 rounded-xl border border-border bg-muted/40 p-4">
            <p className="font-semibold text-foreground">Booking summary</p>
            <p>
              Tour: {tour.title} · {tour.location}
            </p>
            <p>From: {formatPrice(tour.priceFrom)} per guest</p>
            <p>
              Departure: {travelDate ? formatDate(travelDate) : "Not selected"}
            </p>
            <p>Guests: {guests}</p>
            <p>Pick-up: {pickup || "Not specified"}</p>
            <p>Drop-off: {dropoff || "Not specified"}</p>
            <p>Notes: {notes || "None"}</p>
            <p className="pt-2 font-semibold text-foreground">
              Total: {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={previousStep}
          disabled={step === 1 || submitting}
        >
          Back
        </Button>
        <Button onClick={handlePrimary} disabled={!canAdvance || submitting}>
          {step === 3
            ? submitting
              ? "Confirming…"
              : "Confirm booking"
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}
