import { Card, CardContent } from "@/components/ui/card";
import type { Destination } from "@/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Card className="overflow-hidden border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
      <div
        className={`h-32 bg-gradient-to-br ${destination.gradient}`}
        aria-hidden="true"
      />
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{destination.name}</h3>
          <span className="text-xs text-muted-foreground">
            {destination.toursCount} tours
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{destination.blurb}</p>
      </CardContent>
    </Card>
  );
}
