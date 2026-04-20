import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Tour } from "@/types";
import { RatingStars } from "@/components/molecules/RatingStars";

type TourCardProps = {
  tour: Tour;
  featured?: boolean;
};

export function TourCard({ tour, featured }: TourCardProps) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden border-white/60 bg-white/80 shadow-[0_22px_50px_-32px_rgba(92,70,39,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-32px_rgba(92,70,39,0.55)]",
          featured && "md:flex",
        )}
      >
        <div
          className={cn(
            "relative min-h-[180px] overflow-hidden bg-gradient-to-br",
            tour.gradient,
            featured ? "md:min-h-full md:w-2/5" : "h-44",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_60%)]" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Badge className="rounded-full bg-white/80 text-xs text-foreground">
              {tour.category}
            </Badge>
            <Badge variant="secondary" className="rounded-full text-xs">
              {tour.durationDays} days
            </Badge>
          </div>
        </div>
        <CardContent className={cn("space-y-4 p-5", featured && "md:w-3/5")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold leading-tight">
                {tour.title}
              </h3>
              <p className="text-sm text-muted-foreground">{tour.location}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tour.highlights[0]}
          </p>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <RatingStars rating={tour.rating} />
              <p className="text-xs text-muted-foreground">
                {tour.reviewsCount} reviews
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                From
              </p>
              <p className="text-lg font-semibold text-primary">
                {formatPrice(tour.priceFrom)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
