"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDown, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { VehicleFormDialog } from "@/components/organisms/VehicleFormDialog";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { deleteVehicle, upsertVehicle } from "@/lib/supabase/data";
import { toast } from "@/components/molecules/Toaster";
import { confirmAction } from "@/components/molecules/ConfirmDialog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FleetCategory, Vehicle } from "@/types";

const legacyBadgeTones: Record<string, string> = {
  Economy: "bg-emerald-100 text-emerald-800",
  Premium: "bg-amber-100 text-amber-800",
  VIP: "bg-rose-100 text-rose-700",
};
const categoryBadge = (name: string) =>
  legacyBadgeTones[name] ?? "bg-slate-100 text-slate-800";

export default function AdminFleetPage() {
  const {
    vehicles: liveVehicles,
    fleetCategories,
    refresh,
  } = useSupabaseCollections();
  const categoryOptions: ("All" | FleetCategory)[] = useMemo(
    () => [
      "All",
      ...[...fleetCategories]
        .sort((a, b) => {
          const ao = a.order ?? 0;
          const bo = b.order ?? 0;
          if (ao !== bo) return ao - bo;
          return a.title.localeCompare(b.title);
        })
        .map((c) => c.title),
    ],
    [fleetCategories],
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | FleetCategory>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    setVehicles(liveVehicles);
  }, [liveVehicles]);

  const openAdd = () => {
    setEditingVehicle(null);
    setDialogOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleSubmit = async (vehicle: Vehicle) => {
    console.log("[admin/fleet] handleSubmit", vehicle);
    const isEdit = vehicles.some((v) => v.id === vehicle.id);
    try {
      const saved = await upsertVehicle(createSupabaseBrowserClient(), vehicle);
      setVehicles((prev) => {
        const exists = prev.some((v) => v.id === saved.id);
        return exists
          ? prev.map((v) => (v.id === saved.id ? saved : v))
          : [saved, ...prev];
      });
      void refresh();
      toast.success(isEdit ? "Vehicle updated" : "Vehicle added", saved.name);
    } catch (e) {
      toast.error("Couldn't save vehicle", (e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("[admin/fleet] handleDelete", id);
    const removed = vehicles.find((v) => v.id === id);
    const confirmed = await confirmAction({
      title: "Remove this vehicle?",
      description: removed
        ? `"${removed.name}" will be permanently removed from the fleet.`
        : "This vehicle will be permanently removed.",
      confirmLabel: "Remove",
      tone: "destructive",
    });
    if (!confirmed) return;
    const ok = await deleteVehicle(createSupabaseBrowserClient(), id);
    if (ok) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      void refresh();
      toast.success("Vehicle removed", removed?.name);
    } else {
      toast.error("Couldn't remove vehicle");
    }
  };

  const filtered = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        if (category !== "All" && vehicle.fleetCategory !== category)
          return false;
        if (query && !vehicle.name.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [vehicles, query, category],
  );

  const counts = useMemo(
    () => ({
      total: vehicles.length,
      economy: vehicles.filter((v) => v.fleetCategory === "Economy").length,
      premium: vehicles.filter((v) => v.fleetCategory === "Premium").length,
      vip: vehicles.filter((v) => v.fleetCategory === "VIP").length,
    }),
    [vehicles],
  );

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Fleet"
            subtitle="Add vehicles, edit specs, and tune every rate on the card."
          />
          <Button type="button" onClick={openAdd} className="rounded-full">
            <Plus className="size-4" />
            Add vehicle
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FleetStat label="Total vehicles" value={counts.total} />
          <FleetStat label="Economy" value={counts.economy} />
          <FleetStat label="Premium" value={counts.premium} />
          <FleetStat label="VIP" value={counts.vip} />
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory((value ?? "All") as "All" | FleetCategory)
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
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Half day</TableHead>
                  <TableHead>Full day</TableHead>
                  <TableHead>Extra hour</TableHead>
                  <TableHead>Airport</TableHead>
                  <TableHead>Point-to-point</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "size-8 shrink-0 rounded-lg bg-gradient-to-br",
                              vehicle.gradient,
                            )}
                          />
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {vehicle.luggage}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-full",
                            categoryBadge(vehicle.fleetCategory),
                          )}
                        >
                          {vehicle.fleetCategory || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.capacity} pax</TableCell>
                      <TableCell>{formatPrice(vehicle.halfDayPrice)}</TableCell>
                      <TableCell>{formatPrice(vehicle.fullDayPrice)}</TableCell>
                      <TableCell>
                        {formatPrice(vehicle.extraHourPrice)}
                      </TableCell>
                      <TableCell>
                        {formatPrice(vehicle.transferPrice)}
                      </TableCell>
                      <TableCell>
                        {formatPrice(vehicle.pointToPointPrice ?? 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Link
                            href={`/passes/vehicle/${vehicle.id}`}
                            target="_blank"
                            className="inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium hover:bg-accent"
                          >
                            <FileDown className="h-3.5 w-3.5" /> Pass
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            onClick={() => openEdit(vehicle)}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(vehicle.id)}
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
                      colSpan={9}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No vehicles match these filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <VehicleFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialVehicle={editingVehicle}
          onSubmit={handleSubmit}
        />
      </div>
    </RouteGuard>
  );
}

function FleetStat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
      <CardContent className="space-y-1 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
