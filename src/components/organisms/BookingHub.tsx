"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Map, Plane, Route, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { AirportTransferFlow } from "@/components/organisms/AirportTransferFlow";
import { BookingFlow } from "@/components/organisms/BookingFlow";
import { LocalTransportFlow } from "@/components/organisms/LocalTransportFlow";
import { PointToPointFlow } from "@/components/organisms/PointToPointFlow";
import { useBookingStore } from "@/store/booking-store";
import { formatPrice } from "@/lib/format";
import { mockTours } from "@/lib/mock-data";
import type { ServiceType } from "@/types";

const tabs: { value: ServiceType; label: string; Icon: typeof Plane }[] = [
  { value: "tour", label: "Tours", Icon: Map },
  { value: "airport", label: "Airport transfer", Icon: Plane },
  { value: "local", label: "Day hire", Icon: Sun },
  { value: "point-to-point", label: "Point to point", Icon: Route },
];

const isServiceType = (value: string | null): value is ServiceType =>
  value === "tour" ||
  value === "airport" ||
  value === "local" ||
  value === "point-to-point";

type BookingHubProps = {
  initialType: ServiceType;
  initialTourSlug?: string;
};

export function BookingHub({
  initialType,
  initialTourSlug,
}: BookingHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { serviceType, setServiceType } = useBookingStore();

  useEffect(() => {
    setServiceType(initialType);
  }, [initialType, setServiceType]);

  const activeTour = initialTourSlug
    ? mockTours.find((tour) => tour.slug === initialTourSlug)
    : undefined;

  const handleTabChange = (value: string) => {
    if (!isServiceType(value)) return;
    setServiceType(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", value);
    router.replace(`/booking?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {activeTour && serviceType === "tour" ? (
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Selected tour
              </p>
              <h2 className="text-lg font-semibold">{activeTour.title}</h2>
              <p className="text-sm text-muted-foreground">
                {activeTour.location} · {activeTour.durationDays} days
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold text-primary">
                {formatPrice(activeTour.priceFrom)}
              </p>
              <Link
                href={`/tours/${activeTour.slug}`}
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

      <Tabs value={serviceType} onValueChange={handleTabChange}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
          {tabs.map(({ value, label, Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="h-4 w-4" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="tour" className="pt-4">
          <BookingFlow
            tourTitle={activeTour?.title}
            tourLocation={activeTour?.location}
            priceFrom={
              activeTour ? formatPrice(activeTour.priceFrom) : undefined
            }
          />
        </TabsContent>
        <TabsContent value="airport" className="pt-4">
          <AirportTransferFlow />
        </TabsContent>
        <TabsContent value="local" className="pt-4">
          <LocalTransportFlow />
        </TabsContent>
        <TabsContent value="point-to-point" className="pt-4">
          <PointToPointFlow />
        </TabsContent>
      </Tabs>
    </div>
  );
}
