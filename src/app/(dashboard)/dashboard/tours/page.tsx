"use client";

import Link from "next/link";
import { Compass, Heart } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { TourCard } from "@/components/molecules/TourCard";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { useSavedStore } from "@/store/saved-store";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";

export default function CustomerToursPage() {
  const savedSlugs = useSavedStore((state) => state.savedSlugs);
  const { tours } = useSupabaseCollections();
  const savedTours = tours.filter((tour) => savedSlugs.includes(tour.slug));
  const wishlistValue = savedTours.reduce((sum, t) => sum + t.priceFrom, 0);

  const recommendations = tours
    .filter((tour) => !savedSlugs.includes(tour.slug))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <SectionHeading
        title="Tours"
        subtitle="Your saves, your shortlist, and what to explore next."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Saved tours
            </p>
            <p className="text-2xl font-semibold">{savedTours.length}</p>
            <p className="text-xs text-muted-foreground">
              Shortlisted for later
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Wishlist value
            </p>
            <p className="text-2xl font-semibold">
              {formatPrice(wishlistValue)}
            </p>
            <p className="text-xs text-muted-foreground">
              Starting price across your saves
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Catalog
            </p>
            <p className="text-2xl font-semibold">{tours.length}</p>
            <p className="text-xs text-muted-foreground">
              Curated experiences ready to book
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Your saves</h2>
            <p className="text-sm text-muted-foreground">
              Tours you&apos;ve shortlisted from across the catalog.
            </p>
          </div>
          <Link
            href="/tours"
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full",
            })}
          >
            <Compass className="mr-2 h-4 w-4" /> Browse all tours
          </Link>
        </div>
        {savedTours.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-10 text-center shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </span>
            <p className="text-base font-semibold">No saved tours yet</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Save a tour from its details page and it&apos;ll appear here so
              you can come back to it whenever you&apos;re ready to book.
            </p>
            <Link
              href="/tours"
              className={buttonVariants({ className: "mt-2 rounded-full" })}
            >
              Browse experiences
            </Link>
          </div>
        )}
      </div>

      {recommendations.length ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Discover more</h2>
            <p className="text-sm text-muted-foreground">
              Hand-picked tours you haven&apos;t saved yet.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
