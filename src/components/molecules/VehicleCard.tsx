import { Badge } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { Vehicle } from "@/types";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="overflow-hidden border-white/60 bg-white/80 shadow-[0_20px_44px_-32px_rgba(92,70,39,0.4)] transition-all duration-300 hover:-translate-y-1">
      <div className={`h-24 bg-gradient-to-br ${vehicle.gradient}`} />
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{vehicle.name}</h3>
          <Badge variant="secondary" className="rounded-full text-xs">
            {vehicle.capacity} seats
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{vehicle.luggage}</p>
        <div className="flex flex-wrap gap-2">
          {vehicle.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
            >
              {feature}
            </span>
          ))}
        </div>
        <p className="text-sm font-semibold text-primary">
          From {formatPrice(vehicle.priceFrom)}
        </p>
      </CardContent>
    </Card>
  );
}
