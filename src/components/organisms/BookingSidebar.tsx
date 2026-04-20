"use client";

import Link from "next/link";
import { Button } from "@/components/atoms";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { useSavedStore } from "@/store/saved-store";
import type { Tour } from "@/types";

export function BookingSidebar({ tour }: { tour: Tour }) {
  const { toggleSaved, isSaved } = useSavedStore();
  const saved = isSaved(tour.slug);

  return (
    <Card className="sticky top-24 border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
      <CardContent className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            From
          </p>
          <p className="text-2xl font-semibold text-primary">
            {formatPrice(tour.priceFrom)}
          </p>
          <p className="text-sm text-muted-foreground">
            {tour.durationDays} days · {tour.groupSize}
          </p>
        </div>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Availability</span>
            <span className="font-semibold">Limited</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Deposit</span>
            <span className="font-semibold">30% today</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cancellation</span>
            <span className="font-semibold">Free 7 days</span>
          </div>
        </div>
        <Link
          href={`/booking?tour=${tour.slug}`}
          className={buttonVariants({ className: "w-full rounded-full" })}
        >
          Book now
        </Link>
        <Button
          variant={saved ? "secondary" : "outline"}
          className="w-full rounded-full"
          onClick={() => toggleSaved(tour.slug)}
        >
          {saved ? "Saved" : "Save to itinerary"}
        </Button>
      </CardContent>
    </Card>
  );
}
