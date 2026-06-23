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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TourFormDialog } from "@/components/organisms/TourFormDialog";
import { formatPrice } from "@/lib/format";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { deleteTour, upsertTour } from "@/lib/supabase/data";
import { toast } from "@/components/molecules/Toaster";
import { confirmAction } from "@/components/molecules/ConfirmDialog";
import type { Tour, TourCategory } from "@/types";

export default function AdminToursPage() {
  const {
    operators,
    tours: liveTours,
    categories: liveCategories,
    refresh,
    ready,
  } = useSupabaseCollections(["operators", "tours", "categories"]);
  const categoryOptions = useMemo<("All" | TourCategory)[]>(
    () => ["All", ...liveCategories.map((c) => c.title)],
    [liveCategories],
  );
  const [tours, setTours] = useState<Tour[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | TourCategory>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  useEffect(() => {
    setTours(liveTours);
  }, [liveTours]);

  const operatorName = (operatorId: string) =>
    operators.find((op) => op.id === operatorId)?.name ?? "Unknown";

  const openAdd = () => {
    setEditingTour(null);
    setDialogOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setDialogOpen(true);
  };

  const handleSubmit = async (tour: Tour) => {
    console.log("[admin/tours] handleSubmit", tour);
    const isEdit = tours.some((t) => t.id === tour.id);
    try {
      const saved = await upsertTour(createSupabaseBrowserClient(), tour);
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
    console.log("[admin/tours] handleDelete", id);
    const removed = tours.find((t) => t.id === id);
    try {
      await deleteTour(createSupabaseBrowserClient(), id);
      setTours((prev) => prev.filter((t) => t.id !== id));
      void refresh();
      toast.success("Tour deleted", removed?.title);
    } catch (e) {
      toast.error("Couldn't delete tour", (e as Error).message);
    }
  };

  const filtered = useMemo(
    () =>
      tours.filter((tour) => {
        if (category !== "All" && tour.category !== category) return false;
        if (query && !tour.title.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [tours, category, query],
  );

  const counts = useMemo(
    () => ({
      total: tours.length,
      operators: new Set(tours.map((t) => t.operatorId)).size,
      categories: new Set(tours.map((t) => t.category)).size,
    }),
    [tours],
  );

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Tours"
            subtitle="Manage the catalog — add, edit, or remove listings."
          />
          <Button type="button" onClick={openAdd} className="rounded-full">
            <Plus className="size-4" />
            Add tour
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Tours in catalog
              </p>
              <p className="text-2xl font-semibold">{counts.total}</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Operators represented
              </p>
              <p className="text-2xl font-semibold">{counts.operators}</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Categories live
              </p>
              <p className="text-2xl font-semibold">{counts.categories}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by tour title"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as "All" | TourCategory)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Price from</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell>{tour.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full">
                          {tour.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{operatorName(tour.operatorId ?? "")}</TableCell>
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
                      {!ready ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner className="size-4" /> Loading tours…
                        </span>
                      ) : tours.length ? (
                        "No tours match these filters."
                      ) : (
                        "No tours yet. Click 'Add tour' to seed the catalog."
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
