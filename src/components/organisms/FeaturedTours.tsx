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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </Container>
    </section>
  );
}
