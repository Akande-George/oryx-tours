"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Compass,
  Heart,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { TourCard } from "@/components/molecules/TourCard";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDate, formatPrice } from "@/lib/format";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { useSavedStore } from "@/store/saved-store";

const quickLinks = [
  {
    label: "All bookings",
    description: "Manage upcoming and past journeys.",
    href: "/dashboard/bookings",
    icon: BookOpen,
  },
  {
    label: "Saved tours",
    description: "Pick up inspiration where you left off.",
    href: "/dashboard/tours",
    icon: Heart,
  },
  {
    label: "Plan a custom trip",
    description: "Brief our concierge and we'll design it.",
    href: "/personalized",
    icon: Sparkles,
  },
];

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const savedSlugs = useSavedStore((state) => state.savedSlugs);
  const { bookings, tours } = useSupabaseCollections();

  const upcoming = bookings.filter((b) => b.status === "Upcoming");
  const completed = bookings.filter((b) => b.status === "Completed");
  const nextTrip = upcoming[0];
  const totalSpend = completed.reduce((sum, b) => sum + b.price, 0);

  const savedTours = tours.filter((tour) => savedSlugs.includes(tour.slug));
  const recommendations = tours
    .filter((tour) => !savedSlugs.includes(tour.slug))
    .slice(0, 3);

  const firstName = user?.name.split(" ")[0] ?? "traveler";

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Travel lounge
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Welcome back, {firstName}.
        </h1>
        <p className="text-base text-muted-foreground">
          A quick read on your trips, saves, and what to plan next.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Upcoming trips
              </p>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-semibold">{upcoming.length}</p>
            <p className="text-sm text-muted-foreground">
              {upcoming.length
                ? `Next on ${formatDate(upcoming[0].date)}`
                : "Browse curated tours to plan one."}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Saved tours
              </p>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-semibold">{savedSlugs.length}</p>
            <p className="text-sm text-muted-foreground">
              Across destinations you&apos;ve shortlisted.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Lifetime spend
              </p>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-semibold">{formatPrice(totalSpend)}</p>
            <p className="text-sm text-muted-foreground">
              From {completed.length} completed trips.
            </p>
          </CardContent>
        </Card>
      </div>

      {nextTrip ? (
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_22px_50px_-32px_rgba(92,70,39,0.45)] sm:p-8">
          <div
            className={`absolute right-0 top-0 hidden h-full w-1/2 bg-gradient-to-br opacity-60 sm:block ${nextTrip.gradient}`}
          />
          <div className="relative max-w-lg space-y-4">
            <Badge className="rounded-full">Next journey</Badge>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {nextTrip.tourTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatDate(nextTrip.date)} · {nextTrip.guests} guests · ref{" "}
              {nextTrip.reference}
            </p>
            <p className="text-base text-muted-foreground">
              We&apos;ll send pre-trip concierge notes seven days before
              departure. Tap below to review the itinerary.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/bookings"
                className={buttonVariants({ className: "rounded-full" })}
              >
                View booking
              </Link>
              <Link
                href="/personalized"
                className={buttonVariants({
                  variant: "outline",
                  className: "rounded-full",
                })}
              >
                Add a side trip
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <SectionHeading
          title="Jump back in"
          subtitle="Common things you'll want from here."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_16px_36px_-30px_rgba(92,70,39,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-30px_rgba(92,70,39,0.45)]"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Your saved tours"
            subtitle={
              savedSlugs.length
                ? "Pick up planning where you left off."
                : "Tap the heart on any tour to start a shortlist."
            }
          />
          {savedSlugs.length > 3 ? (
            <Link
              href="/dashboard/tours"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Heart className="h-4 w-4" /> View all {savedSlugs.length} saved
            </Link>
          ) : null}
        </div>
        {savedTours.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedTours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-3xl border border-dashed border-primary/30 bg-primary/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Heart className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-lg font-semibold">
                  No saved tours yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse the catalog and tap the heart on any tour — it&apos;ll
                  land here for easy access later.
                </p>
              </div>
            </div>
            <Link
              href="/tours"
              className={buttonVariants({ className: "rounded-full" })}
            >
              Browse tours
            </Link>
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Recommended for you"
            subtitle="Curated journeys based on your saves and travel rhythm."
          />
          <Link
            href="/tours"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Compass className="h-4 w-4" /> Browse all tours
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </div>
  );
}
