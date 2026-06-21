import { SearchBar } from "@/components/molecules/SearchBar";
import { TourCard } from "@/components/molecules/TourCard";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { FiltersPanel } from "@/components/organisms/FiltersPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTours } from "@/lib/supabase/data";
import type { Tour, TourCategory } from "@/types";

type ToursPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    date?: string;
    guests?: string;
    duration?: string;
    rating?: string;
  }>;
};

const matchesDuration = (days: number, range: string) => {
  switch (range) {
    case "1-2 days":
      return days <= 2;
    case "3-5 days":
      return days >= 3 && days <= 5;
    case "6+ days":
      return days >= 6;
    default:
      return true;
  }
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const { q, category, guests, duration, rating } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const allTours = await getTours(supabase);

  const ratingThreshold = rating ? Number(rating) : 0;

  const tours = allTours.filter((tour: Tour) => {
    if (category && tour.category !== (category as TourCategory)) return false;
    if (q) {
      const needle = q.toLowerCase();
      const haystack = [
        tour.title,
        tour.location,
        tour.region,
        tour.description,
        ...(tour.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (guests) {
      const required = Number(guests);
      if (Number.isFinite(required) && required >= 1) {
        const cap = parseInt(tour.groupSize.replace(/[^0-9]/g, ""), 10);
        if (Number.isFinite(cap) && cap > 0 && cap < required) return false;
      }
    }
    if (duration && !matchesDuration(tour.durationDays, duration)) return false;
    if (ratingThreshold > 0 && tour.rating < ratingThreshold) return false;
    return true;
  });

  const activeFilters = [
    q ? `"${q}"` : null,
    category ? `Category: ${category}` : null,
    guests ? `${guests} guests` : null,
    duration && duration !== "Any" ? duration : null,
    ratingThreshold > 0 ? `${ratingThreshold}+ stars` : null,
  ].filter(Boolean);

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <SectionHeading
          title="Tours and experiences"
          subtitle="Choose from curated itineraries with private guides and premium stays."
        />
        <SearchBar variant="compact" />
        <FiltersPanel />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {tours.length} of {allTours.length} experiences
            {activeFilters.length
              ? ` — filtered by ${activeFilters.join(" · ")}`
              : ""}
          </p>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {tours.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/60 bg-white/60 p-10 text-center text-sm text-muted-foreground">
            No tours match those filters. Try removing one to widen the search.
          </div>
        )}
      </Container>
    </div>
  );
}
