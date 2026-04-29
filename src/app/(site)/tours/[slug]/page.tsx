import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RatingStars } from "@/components/molecules/RatingStars";
import { BookingSidebar } from "@/components/organisms/BookingSidebar";
import { OperatorCard } from "@/components/organisms/OperatorCard";
import { TourDetailsTabs } from "@/components/organisms/TourDetailsTabs";
import { Badge } from "@/components/atoms";
import { mockOperators, mockReviews, mockTours } from "@/lib/mock-data";

export default async function TourDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const matchedTour = mockTours.find((item) => item.slug === slug);
  const tour = matchedTour ?? mockTours[0];
  const isFallback = !matchedTour;

  const operator = mockOperators.find((item) => item.id === tour.operatorId);

  return (
    <div className="py-12">
      <Container className="space-y-10">
        <div className="space-y-4">
          {isFallback ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Showing a sample tour while this page is configured.
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full">{tour.category}</Badge>
            <Badge variant="secondary" className="rounded-full">
              {tour.durationDays} days
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {tour.groupSize}
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{tour.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{tour.location}</span>
            <span>•</span>
            <RatingStars rating={tour.rating} />
            <span>{tour.reviewsCount} reviews</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {tour.gallery.map((gradient, index) => (
              <div
                key={`${tour.id}-${index}`}
                className={`h-48 rounded-2xl bg-gradient-to-br ${gradient}`}
              />
            ))}
          </div>
          <BookingSidebar tour={tour} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <SectionHeading
              title="About this experience"
              subtitle="Every detail is curated with a dedicated concierge."
            />
            <TourDetailsTabs
              highlights={tour.highlights}
              tags={tour.tags}
              reviews={mockReviews}
              defaultTab={
                tab === "itinerary" || tab === "reviews" ? tab : "overview"
              }
            />
          </div>
          <div className="space-y-4">
            {operator ? <OperatorCard operator={operator} /> : null}
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 text-sm text-muted-foreground shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Included
              </p>
              <ul className="mt-3 space-y-2">
                {tour.includes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
