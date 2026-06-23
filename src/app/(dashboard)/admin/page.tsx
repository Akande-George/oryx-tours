"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  Map as MapIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { RouteGuard } from "@/components/providers/RouteGuard";

const quickLinks = [
  {
    href: "/admin/tours",
    label: "Tours",
    description: "Manage the catalog — add, edit, or remove listings.",
    icon: MapIcon,
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    description: "All bookings across operators with status filters.",
    icon: Calendar,
  },
  {
    href: "/admin/revenue",
    label: "Revenue",
    description: "Financial analytics, breakdowns, and trends.",
    icon: BarChart3,
  },
];

export default function AdminOverviewPage() {
  const { bookings, operators } = useSupabaseCollections([
    "bookings",
    "operators",
  ]);
  const revenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.price, 0);
  const upcomingCount = bookings.filter((b) => b.status === "Upcoming").length;

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Admin command center"
          subtitle="A snapshot of inventory and bookings across the platform."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Revenue (active)
              </p>
              <p className="text-2xl font-semibold">{formatPrice(revenue)}</p>
              <p className="text-sm text-muted-foreground">
                Across {bookings.length} bookings on file
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Active bookings
              </p>
              <p className="text-2xl font-semibold">{upcomingCount}</p>
              <p className="text-sm text-muted-foreground">
                Upcoming across {operators.length} operators
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Operators
              </p>
              <p className="text-2xl font-semibold">{operators.length}</p>
              <p className="text-sm text-muted-foreground">
                Partner accounts on the platform
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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
    </RouteGuard>
  );
}
