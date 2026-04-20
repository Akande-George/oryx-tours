"use client";

import { SectionHeading } from "@/components/layout/SectionHeading";
import { TourCard } from "@/components/molecules/TourCard";
import { mockTours } from "@/lib/mock-data";
import { useSavedStore } from "@/store/saved-store";

export default function SavedToursPage() {
  const savedSlugs = useSavedStore((state) => state.savedSlugs);
  const savedTours = mockTours.filter((tour) => savedSlugs.includes(tour.slug));

  return (
    <div className="space-y-8">
      <SectionHeading
        title="Saved tours"
        subtitle="Keep inspiration ready for your next journey."
      />
      {savedTours.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {savedTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/60 bg-white/80 p-6 text-sm text-muted-foreground shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          No saved tours yet. Save a tour from the details page to see it here.
        </div>
      )}
    </div>
  );
}
