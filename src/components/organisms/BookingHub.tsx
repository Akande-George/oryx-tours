"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plane, Route, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AirportTransferFlow } from "@/components/organisms/AirportTransferFlow";
import { LocalTransportFlow } from "@/components/organisms/LocalTransportFlow";
import { PointToPointFlow } from "@/components/organisms/PointToPointFlow";
import { useBookingStore } from "@/store/booking-store";
import type { ServiceType } from "@/types";

const tabs: { value: ServiceType; label: string; Icon: typeof Plane }[] = [
  { value: "airport", label: "Airport transfer", Icon: Plane },
  { value: "local", label: "Day hire", Icon: Sun },
  { value: "point-to-point", label: "Point to point", Icon: Route },
];

const isServiceType = (value: string | null): value is ServiceType =>
  value === "airport" || value === "local" || value === "point-to-point";

type BookingHubProps = {
  initialType: ServiceType;
};

export function BookingHub({ initialType }: BookingHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { serviceType, setServiceType } = useBookingStore();

  useEffect(() => {
    setServiceType(initialType);
  }, [initialType, setServiceType]);

  const handleTabChange = (value: string) => {
    if (!isServiceType(value)) return;
    setServiceType(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", value);
    router.replace(`/booking?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <Tabs value={serviceType} onValueChange={handleTabChange}>
        <TabsList className="grid !h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3">
          {tabs.map(({ value, label, Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="h-4 w-4" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

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
