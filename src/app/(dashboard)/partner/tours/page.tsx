"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { TourFormDialog } from "@/components/organisms/TourFormDialog";
import { formatPrice } from "@/lib/format";
import { mockTours } from "@/lib/mock-data";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Tour } from "@/types";

export default function PartnerToursPage() {
  const { user } = useAuth();
  const operatorId = user?.operatorId ?? "";

  const [tours, setTours] = useState<Tour[]>([]);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  useEffect(() => {
    if (!operatorId) return;
    setTours(mockTours.filter((tour) => tour.operatorId === operatorId));
  }, [operatorId]);

  const filtered = useMemo(
    () =>
      tours.filter((tour) =>
        tour.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [tours, query],
  );

  const openAdd = () => {
    setEditingTour(null);
    setDialogOpen(true);
  };
  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setDialogOpen(true);
  };

  const handleSubmit = (tour: Tour) => {
    const scoped: Tour = { ...tour, operatorId };
    setTours((prev) => {
      const exists = prev.some((t) => t.id === scoped.id);
      return exists
        ? prev.map((t) => (t.id === scoped.id ? scoped : t))
        : [scoped, ...prev];
    });
  };

  const handleDelete = (id: string) => {
    setTours((prev) => prev.filter((tour) => tour.id !== id));
  };

  return (
    <RouteGuard allow={["partner"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Your tours"
            subtitle="Add new tours with full content — gallery, itinerary, video, pricing."
          />
          <Button type="button" onClick={openAdd} className="rounded-full">
            <Plus className="size-4" /> Add tour
          </Button>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by tour name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price from</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell className="font-medium">
                        {tour.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full">
                          {tour.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{tour.durationDays} days</TableCell>
                      <TableCell>{formatPrice(tour.priceFrom)}</TableCell>
                      <TableCell>{tour.rating.toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            onClick={() => openEdit(tour)}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(tour.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
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
                      {tours.length
                        ? "No tours match this search."
                        : "You haven't added any tours yet. Click 'Add tour' to get started."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <TourFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialTour={editingTour}
          onSubmit={handleSubmit}
        />
      </div>
    </RouteGuard>
  );
}
