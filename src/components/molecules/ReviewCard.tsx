import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types";
import { RatingStars } from "@/components/molecules/RatingStars";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="border-white/60 bg-white/80 shadow-[0_14px_34px_-28px_rgba(92,70,39,0.35)]">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{review.name}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
          <RatingStars rating={review.rating} />
        </div>
        <p className="text-sm text-muted-foreground">{review.content}</p>
      </CardContent>
    </Card>
  );
}
