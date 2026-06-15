"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Car, Map, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatPrice } from "@/lib/format";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";

export default function PartnerOverviewPage() {
  const { user } = useAuth();
  const operatorId = user?.operatorId ?? "";
  const { bookings, tours, vehicles } = useSupabaseCollections();

  const myTours = useMemo(
    () => tours.filter((tour) => tour.operatorId === operatorId),
    [operatorId, tours],
  );

  const myVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.operatorId === operatorId),
    [operatorId, vehicles],
  );

  const myBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        myTours.some((tour) => tour.id === booking.tourId),
      ),
    [bookings, myTours],
  );

  const earnings = myBookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + booking.price, 0);
  const upcoming = myBookings.filter(
    (booking) => booking.status === "Upcoming",
  ).length;
  const avgRating =
    myTours.length === 0
      ? 0
      : myTours.reduce((sum, tour) => sum + tour.rating, 0) / myTours.length;

  return (
    <RouteGuard allow={["partner"]}>
      <div className="space-y-8">
        <SectionHeading
          title={`Welcome back, ${user?.name?.split(" ")[0] ?? "partner"}`}
          subtitle="Snapshot of your tours, fleet, and bookings."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Earnings"
            value={formatPrice(earnings)}
            sub={`From ${myBookings.length} bookings`}
            icon={TrendingUp}
          />
          <Stat
            label="Upcoming bookings"
            value={String(upcoming)}
            sub="Confirmed departures"
            icon={Calendar}
          />
          <Stat
            label="Active tours"
            value={String(myTours.length)}
            sub={`Avg rating ${avgRating.toFixed(1)}`}
            icon={Map}
          />
          <Stat
            label="Fleet vehicles"
            value={String(myVehicles.length)}
            sub="Across all categories"
            icon={Car}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ActionCard
            icon={Map}
            title="Manage your tours"
            description="Add new tours with full content — itinerary, gallery, video, pricing."
            href="/partner/tours"
            cta="Open tours"
          />
          <ActionCard
            icon={Car}
            title="Manage your fleet"
            description="Add vehicles, set rates for each service, upload photos."
            href="/partner/fleet"
            cta="Open fleet"
          />
          <ActionCard
            icon={Calendar}
            title="View bookings"
            description="See bookings scoped to your tours and fleet."
            href="/partner/bookings"
            cta="Open bookings"
          />
        </div>
      </div>
    </RouteGuard>
  );
}

function Stat({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Calendar;
}) {
  return (
    <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: typeof Calendar;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
      <CardContent className="space-y-3 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Link
          href={href}
          className={buttonVariants({
            variant: "outline",
            className: "mt-2 w-full rounded-full",
          })}
        >
          {cta} <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
