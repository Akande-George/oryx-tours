import { Badge } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types";

type VehicleCardProps = {
  vehicle: Vehicle;
  onSelect?: () => void;
  selected?: boolean;
  className?: string;
};

export function VehicleCard({
  vehicle,
  onSelect,
  selected = false,
  className,
}: VehicleCardProps) {
  const heroImage = vehicle.images?.[0];

  const card = (
    <Card
      className={cn(
        "overflow-hidden border-white/60 bg-white/80 shadow-[0_20px_44px_-32px_rgba(92,70,39,0.4)] transition-all duration-300 hover:-translate-y-1",
        selected && "ring-2 ring-primary/40",
        className,
      )}
    >
      {heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroImage}
          alt={vehicle.name}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className={`h-24 bg-gradient-to-br ${vehicle.gradient}`} />
      )}
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{vehicle.name}</h3>
          <Badge variant="secondary" className="rounded-full text-xs">
            {vehicle.fleetCategory}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {vehicle.capacity} seats · {vehicle.luggage}
        </p>
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
        <div className="flex items-baseline justify-between pt-1">
          <p className="text-sm font-semibold text-primary">
            From {formatPrice(vehicle.halfDayPrice)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
      >
        {card}
      </button>
    );
  }

  return card;
}
