"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge, Button, Input, Spinner } from "@/components/atoms";
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
import { formatDuration, formatPrice } from "@/lib/format";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { deleteTour, upsertTour } from "@/lib/supabase/data";
import { toast } from "@/components/molecules/Toaster";
import { confirmAction } from "@/components/molecules/ConfirmDialog";
import type { Tour } from "@/types";

export default function PartnerToursPage() {
  const { user } = useAuth();
  const operatorId = user?.operatorId ?? "";
  const { tours: liveTours, refresh, ready } = useSupabaseCollections([
    "tours",
  ]);

  const [tours, setTours] = useState<Tour[]>([]);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  useEffect(() => {
    if (!operatorId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTours(liveTours.filter((tour) => tour.operatorId === operatorId));
  }, [operatorId, liveTours]);

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

  const handleSubmit = async (tour: Tour) => {
    const scoped: Tour = { ...tour, operatorId };
    console.log("[partner/tours] handleSubmit", { scoped, operatorId });
    const isEdit = tours.some((t) => t.id === scoped.id);
    try {
      const saved = await upsertTour(createSupabaseBrowserClient(), scoped);
      setTours((prev) => {
        const exists = prev.some((t) => t.id === saved.id);
        return exists
          ? prev.map((t) => (t.id === saved.id ? saved : t))
          : [saved, ...prev];
      });
      void refresh();
      void fetch("/api/notifications/tour-saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId: saved.id, isNew: !isEdit }),
      }).catch(() => {});
      toast.success(isEdit ? "Tour updated" : "Tour added", saved.title);
    } catch (e) {
      toast.error("Couldn't save tour", (e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("[partner/tours] handleDelete", id);
    const removed = tours.find((t) => t.id === id);
    const ok = await confirmAction({
      title: "Delete this tour?",
      description: removed
        ? `"${removed.title}" will be permanently removed.`
        : "This tour will be permanently removed.",
      confirmLabel: "Delete",
      tone: "destructive",
    });
    if (!ok) return;
    try {
      await deleteTour(createSupabaseBrowserClient(), id);
      setTours((prev) => prev.filter((tour) => tour.id !== id));
      void refresh();
      toast.success("Tour deleted", removed?.title);
    } catch (e) {
      toast.error("Couldn't delete tour", (e as Error).message);
    }
  };

  return (
    <RouteGuard allow={["partner"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Your tours"
            subtitle="Add new tours with full content - gallery, itinerary, video, pricing."
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
                      <TableCell>{formatDuration(tour)}</TableCell>
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
                      {!ready ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner className="size-4" /> Loading tours…
                        </span>
                      ) : tours.length ? (
                        "No tours match this search."
                      ) : (
                        "You haven't added any tours yet. Click 'Add tour' to get started."
                      )}
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
