import { Badge } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui/card";
import type { Operator } from "@/types";

export function OperatorCard({ operator }: { operator: Operator }) {
  return (
    <Card className="border-white/60 bg-white/80 shadow-[0_14px_30px_-26px_rgba(92,70,39,0.35)]">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold">{operator.name}</p>
            <p className="text-sm text-muted-foreground">
              {operator.yearsActive} years · {operator.rating} rating
            </p>
          </div>
          <Badge className="rounded-full">{operator.topBadge}</Badge>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Response time: {operator.responseTime}</p>
          <p>Languages: {operator.languages.join(", ")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
