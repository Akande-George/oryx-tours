"use client";

import { useState } from "react";
import { ActionButton } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingCard } from "@/components/molecules/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBookings } from "@/lib/mock-data";
import { BookingDetailsDialog } from "@/components/organisms/BookingDetailsDialog";
import type { Booking } from "@/types";

type BookingsManagerProps = {
  title: string;
  subtitle: string;
};

const tabDefinitions = [
  { value: "upcoming", label: "Upcoming", status: "Upcoming" },
  { value: "completed", label: "Completed", status: "Completed" },
  { value: "cancelled", label: "Cancelled", status: "Cancelled" },
] as const;

export function BookingsManager({ title, subtitle }: BookingsManagerProps) {
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <div className="space-y-8">
      <SectionHeading title={title} subtitle={subtitle} />

      <Tabs defaultValue="upcoming">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3">
          {tabDefinitions.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabDefinitions.map((tab) => {
          const items = mockBookings.filter((b) => b.status === tab.status);
          return (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="space-y-4"
            >
              {items.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onClick={() => setSelected(booking)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/60 bg-white/70 p-6 text-sm text-muted-foreground">
                  No {tab.label.toLowerCase()} bookings yet.
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <ActionButton
          label="Download receipts"
          variant="outline"
          className="rounded-full"
          action="print"
        />
      </div>

      <BookingDetailsDialog
        booking={selected}
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
