"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  Map as MapIcon,
} from "lucide-react";
import { Badge } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { mockBookings, mockOperators, mockTours } from "@/lib/mock-data";
import { RouteGuard } from "@/components/providers/RouteGuard";

const quickLinks = [
  {
    href: "/admin/tours",
    label: "Tour approvals",
    description: "Review pending submissions and manage the catalog.",
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
  const revenue = mockBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.price, 0);
  const upcomingCount = mockBookings.filter(
    (b) => b.status === "Upcoming",
  ).length;
  const pendingApprovals = Math.max(2, Math.round(mockTours.length / 3));

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Admin command center"
          subtitle="A snapshot of inventory, partner approvals, and system health."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Revenue (active)
              </p>
              <p className="text-2xl font-semibold">{formatPrice(revenue)}</p>
              <p className="text-sm text-muted-foreground">
                Across {mockBookings.length} bookings on file
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Pending approvals
              </p>
              <p className="text-2xl font-semibold">{pendingApprovals}</p>
              <p className="text-sm text-muted-foreground">
                Tours awaiting review
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
                Upcoming across {mockOperators.length} operators
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
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
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 text-sm text-muted-foreground shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              System status
            </p>
            <div className="flex items-center justify-between">
              <span>Fraud monitoring</span>
              <Badge className="rounded-full bg-emerald-100 text-emerald-800">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Payments</span>
              <Badge className="rounded-full bg-emerald-100 text-emerald-800">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Partner onboarding</span>
              <Badge className="rounded-full bg-amber-100 text-amber-800">
                {pendingApprovals ? "Backlog" : "Clear"}
              </Badge>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold text-foreground">
                Action queue
              </p>
              <p className="mt-2">
                {pendingApprovals
                  ? `${pendingApprovals} tour submissions awaiting review.`
                  : "All caught up — no pending approvals."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
