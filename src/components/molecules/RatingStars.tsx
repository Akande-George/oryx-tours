import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  size?: number;
  className?: string;
};

export function RatingStars({
  rating,
  size = 14,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = rating >= index + 1;
        return (
          <Star
            key={`star-${index}`}
            size={size}
            className={cn(
              "text-muted-foreground",
              filled && "fill-amber-400 text-amber-500",
            )}
          />
        );
      })}
    </div>
  );
}
