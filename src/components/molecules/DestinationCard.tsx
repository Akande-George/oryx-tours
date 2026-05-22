import { PlaceCard } from "@/components/ui/card-22";
import type { Destination } from "@/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <PlaceCard
      images={destination.images}
      tags={destination.tags}
      rating={destination.rating}
      title={destination.name}
      dateRange={`${destination.toursCount} curated tours`}
      hostType={destination.country}
      isTopRated={destination.rating >= 4.85}
      description={destination.blurb}
      priceFrom={destination.priceFrom}
      href="/tours"
    />
  );
}
