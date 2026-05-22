"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Input } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import { mockBookings, mockOperators, mockTours } from "@/lib/mock-data";
import { RouteGuard } from "@/components/providers/RouteGuard";

type PartnerTour = {
  id: string;
  title: string;
  category: string;
  durationDays: number;
  priceFrom: number;
  status: "Published" | "Draft";
};

const initialForm = {
  title: "",
  location: "",
  duration: "",
  price: "",
  highlights: "",
};

export default function PartnerDashboardPage() {
  const operator = mockOperators[0];

  const seededTours = useMemo<PartnerTour[]>(
    () =>
      mockTours
        .filter((tour) => tour.operatorId === operator.id)
        .map((tour) => ({
          id: tour.id,
          title: tour.title,
          category: tour.category,
          durationDays: tour.durationDays,
          priceFrom: tour.priceFrom,
          status: "Published",
        })),
    [operator.id],
  );

  const [tours, setTours] = useState<PartnerTour[]>(seededTours);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(search.toLowerCase()),
  );

  const partnerBookings = mockBookings.filter((booking) =>
    seededTours.some((tour) => tour.id === booking.tourId),
  );

  const earnings = partnerBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.price, 0);
  const upcomingCount = partnerBookings.filter(
    (b) => b.status === "Upcoming",
  ).length;
  const avgRating =
    seededTours.length === 0
      ? 0
      : mockTours
          .filter((tour) => tour.operatorId === operator.id)
          .reduce((sum, t) => sum + t.rating, 0) /
        seededTours.length;

  const handleSubmit = () => {
    if (!form.title.trim() || !form.duration.trim() || !form.price.trim()) {
      setFormError("Title, duration, and price are required.");
      setFormSuccess(null);
      return;
    }
    const durationDays = Number(form.duration);
    const priceFrom = Number(form.price);
    if (Number.isNaN(durationDays) || Number.isNaN(priceFrom)) {
      setFormError("Duration and price must be numeric.");
      setFormSuccess(null);
      return;
    }
    const newTour: PartnerTour = {
      id: `tour-draft-${Date.now()}`,
      title: form.title.trim(),
      category: "Custom",
      durationDays,
      priceFrom,
      status: "Draft",
    };
    setTours((prev) => [newTour, ...prev]);
    setForm(initialForm);
    setFormError(null);
    setFormSuccess(`Saved "${newTour.title}" as a draft.`);
  };

  const removeTour = (id: string) => {
    setTours((prev) => prev.filter((tour) => tour.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTours((prev) =>
      prev.map((tour) =>
        tour.id === id
          ? {
              ...tour,
              status: tour.status === "Published" ? "Draft" : "Published",
            }
          : tour,
      ),
    );
  };

  return (
    <RouteGuard allow={["partner", "admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Partner operator dashboard"
          subtitle={`Manage ${operator.name} tours, bookings, and revenue.`}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Earnings
              </p>
              <p className="text-2xl font-semibold">{formatPrice(earnings)}</p>
              <p className="text-sm text-muted-foreground">
                From {partnerBookings.length} bookings on file
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Upcoming bookings
              </p>
              <p className="text-2xl font-semibold">{upcomingCount}</p>
              <p className="text-sm text-muted-foreground">
                Confirmed for upcoming departures
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Avg tour rating
              </p>
              <p className="text-2xl font-semibold">{avgRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">
                Across {seededTours.length} active tours
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-semibold">Manage tours</p>
            <Input
              placeholder="Search tours"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full sm:w-[240px]"
            />
          </div>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price from</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.length ? (
                  filteredTours.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell>{tour.title}</TableCell>
                      <TableCell>{tour.category}</TableCell>
                      <TableCell>{tour.durationDays} days</TableCell>
                      <TableCell>{formatPrice(tour.priceFrom)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full ${tour.status === "Published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                        >
                          {tour.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => toggleStatus(tour.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />{" "}
                            {tour.status === "Published"
                              ? "Unpublish"
                              : "Publish"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => removeTour(tour.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No tours match this search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Add a new tour</p>
            <Badge variant="secondary" className="rounded-full">
              Saves as draft
            </Badge>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Tour name"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
            />
            <Input
              placeholder="Duration (days)"
              value={form.duration}
              onChange={(event) =>
                setForm({ ...form, duration: event.target.value })
              }
            />
            <Input
              placeholder="Base price (USD)"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
            />
            <Textarea
              placeholder="Highlights"
              value={form.highlights}
              onChange={(event) =>
                setForm({ ...form, highlights: event.target.value })
              }
              className="md:col-span-2 min-h-[120px]"
            />
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                {formError ? (
                  <p className="text-destructive">{formError}</p>
                ) : formSuccess ? (
                  <p className="text-primary">{formSuccess}</p>
                ) : null}
              </div>
              <Button type="submit" className="rounded-full">
                <Plus className="h-3.5 w-3.5" /> Save tour
              </Button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <p className="text-sm font-semibold">Recent bookings on your tours</p>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerBookings.length ? (
                  partnerBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.reference}</TableCell>
                      <TableCell>{booking.tourTitle}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>{formatPrice(booking.price)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No bookings for your tours yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
