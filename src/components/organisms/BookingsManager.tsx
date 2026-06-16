"use client";

import { useEffect, useMemo, useState } from "react";
import { ActionButton } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingCard } from "@/components/molecules/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsDialog } from "@/components/organisms/BookingDetailsDialog";
import type { Booking, BookingStatus } from "@/types";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { useAuth } from "@/components/providers/AuthProvider";

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
  const { user } = useAuth();
  const { bookings: liveBookings } = useSupabaseCollections();
  const myBookings = useMemo(
    () =>
      user ? liveBookings.filter((b) => b.customerId === user.id) : [],
    [liveBookings, user],
  );
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(myBookings);
  }, [myBookings]);

  const handleStatusChange = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
    setSelected((current) =>
      current && current.id === id ? { ...current, status } : current,
    );
  };

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
          const items = bookings.filter((b) => b.status === tab.status);
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
        cancellable
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
