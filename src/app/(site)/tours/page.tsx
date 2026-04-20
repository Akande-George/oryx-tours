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
import { mockTours } from "@/lib/mock-data";

export default function ToursPage() {
  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionHeading
          title="Tours and experiences"
          subtitle="Choose from curated itineraries with private guides and premium stays."
        />
        <SearchBar variant="compact" />
        <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
          <FiltersPanel />
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {mockTours.length} curated experiences
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
            <div className="grid gap-6 md:grid-cols-2">
              {mockTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-6 py-4 text-sm text-muted-foreground">
              <span>Page 1 of 4</span>
              <span>Infinite scroll ready</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
