import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingFlow } from "@/components/organisms/BookingFlow";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { mockTours } from "@/lib/mock-data";

export default function BookingPage({
  searchParams,
}: {
  searchParams: { tour?: string };
}) {
  const selectedTour = mockTours.find(
    (tour) => tour.slug === searchParams.tour,
  );

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <SectionHeading
          title="Secure your booking"
          subtitle="A seamless three-step journey to confirm your experience."
        />
        {selectedTour ? (
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Selected tour
                </p>
                <h2 className="text-lg font-semibold">{selectedTour.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedTour.location} · {selectedTour.durationDays} days
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold text-primary">
                  {formatPrice(selectedTour.priceFrom)}
                </p>
                <Link
                  href={`/tours/${selectedTour.slug}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "rounded-full",
                  })}
                >
                  View details
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}
        <BookingFlow
          tourTitle={selectedTour?.title}
          tourLocation={selectedTour?.location}
          priceFrom={
            selectedTour ? formatPrice(selectedTour.priceFrom) : undefined
          }
        />
      </Container>
    </div>
  );
}
