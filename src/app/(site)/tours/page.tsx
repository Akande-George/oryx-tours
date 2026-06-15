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

export default async function ToursPage() {
  const supabase = await createSupabaseServerClient();
  const tours = await getTours(supabase);

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
            Showing {tours.length} curated experiences
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-6 py-4 text-sm text-muted-foreground">
          <span>Page 1 of 4</span>
          <span>Infinite scroll ready</span>
        </div>
      </Container>
    </div>
  );
}
