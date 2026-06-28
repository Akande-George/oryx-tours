import { PlaceCard } from "@/components/ui/card-22";
import { htmlToPlainText } from "@/lib/rich-text";
import type { Tour } from "@/types";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <PlaceCard
      images={tour.images}
      tags={[tour.category, ...tour.tags].slice(0, 2)}
      rating={tour.rating}
      title={tour.title}
      dateRange={tour.duration?.trim() || `${tour.durationDays}-day journey`}
      hostType={tour.region}
      isTopRated={tour.rating >= 4.85 || tour.tags.includes("Top rated")}
      description={htmlToPlainText(tour.description)}
      priceFrom={tour.priceFrom}
      priceSuffix="PP"
      href={`/tours/${tour.slug}`}
    />
  );
}
