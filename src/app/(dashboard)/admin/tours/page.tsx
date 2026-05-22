"use client";

import { useMemo, useState } from "react";
import { Check, Pencil, Plus, Search, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TourFormDialog } from "@/components/organisms/TourFormDialog";
import { formatPrice } from "@/lib/format";
import { mockOperators, mockTours } from "@/lib/mock-data";
import { RouteGuard } from "@/components/providers/RouteGuard";
import type { Tour, TourCategory } from "@/types";

type ApprovalState = "Awaiting" | "Approved" | "Rejected";

const approvalBadge: Record<ApprovalState, string> = {
  Awaiting: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-rose-100 text-rose-700",
};

const categoryOptions: ("All" | TourCategory)[] = [
  "All",
  "Luxury",
  "Adventure",
  "Culture",
  "Wellness",
  "Sports",
  "Medical",
];

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const initial = useMemo<Record<string, ApprovalState>>(() => {
    const seed: Record<string, ApprovalState> = {};
    mockTours.forEach((tour, idx) => {
      seed[tour.id] = idx < 3 ? "Awaiting" : "Approved";
    });
    return seed;
  }, []);

  const [approvals, setApprovals] = useState(initial);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | TourCategory>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const operatorName = (operatorId: string) =>
    mockOperators.find((op) => op.id === operatorId)?.name ?? "Unknown";

  const decide = (tourId: string, state: ApprovalState) => {
    setApprovals((prev) => ({ ...prev, [tourId]: state }));
  };

  const openAdd = () => {
    setEditingTour(null);
    setDialogOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setDialogOpen(true);
  };

  const handleSubmit = (tour: Tour) => {
    setTours((prev) => {
      const exists = prev.some((t) => t.id === tour.id);
      return exists
        ? prev.map((t) => (t.id === tour.id ? tour : t))
        : [tour, ...prev];
    });
    if (!approvals[tour.id]) {
      setApprovals((prev) => ({ ...prev, [tour.id]: "Awaiting" }));
    }
  };

  const filtered = tours.filter((tour) => {
    if (category !== "All" && tour.category !== category) return false;
    if (query && !tour.title.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

  const counts = {
    awaiting: Object.values(approvals).filter((s) => s === "Awaiting").length,
    approved: Object.values(approvals).filter((s) => s === "Approved").length,
    rejected: Object.values(approvals).filter((s) => s === "Rejected").length,
  };

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Tours"
            subtitle="Review submissions, approve listings, and manage the catalog."
          />
          <Button
            type="button"
            onClick={openAdd}
            className="rounded-full"
          >
            <Plus className="size-4" />
            Add tour
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Awaiting review
              </p>
              <p className="text-2xl font-semibold">{counts.awaiting}</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Approved
              </p>
              <p className="text-2xl font-semibold">{counts.approved}</p>
            </CardContent>
          </Card>
          <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Rejected
              </p>
              <p className="text-2xl font-semibold">{counts.rejected}</p>
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((tour) => {
                    const state = approvals[tour.id] ?? "Awaiting";
                    return (
                      <TableRow key={tour.id}>
                        <TableCell>{tour.title}</TableCell>
                        <TableCell>{tour.category}</TableCell>
                        <TableCell>{operatorName(tour.operatorId)}</TableCell>
                        <TableCell>{formatPrice(tour.priceFrom)}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-full ${approvalBadge[state]}`}>
                            {state}
                          </Badge>
                        </TableCell>
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
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              onClick={() => decide(tour.id, "Approved")}
                              disabled={state === "Approved"}
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-destructive hover:bg-destructive/10"
                              onClick={() => decide(tour.id, "Rejected")}
                              disabled={state === "Rejected"}
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No tours match these filters.
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
