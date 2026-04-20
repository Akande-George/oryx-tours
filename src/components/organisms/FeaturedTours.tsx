import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { TourCard } from "@/components/molecules/TourCard";
import type { Tour } from "@/types";

export function FeaturedTours({ tours }: { tours: Tour[] }) {
  return (
    <section className="py-16">
      <Container className="space-y-8">
        <SectionHeading
          title="Featured experiences"
          subtitle="Private itineraries crafted for travelers who prefer seamless."
        />
        <div className="flex gap-6 overflow-x-auto pb-4">
          {tours.map((tour) => (
            <div key={tour.id} className="min-w-[280px] flex-1">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
