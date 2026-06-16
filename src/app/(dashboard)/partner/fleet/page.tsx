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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormDialog } from "@/components/organisms/VehicleFormDialog";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { deleteVehicle, upsertVehicle } from "@/lib/supabase/data";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FleetCategory, Vehicle } from "@/types";

const categoryOptions: ("All" | FleetCategory)[] = [
  "All",
  "Economy",
  "Premium",
  "VIP",
];

const categoryBadge: Record<FleetCategory, string> = {
  Economy: "bg-emerald-100 text-emerald-800",
  Premium: "bg-amber-100 text-amber-800",
  VIP: "bg-rose-100 text-rose-700",
};

export default function PartnerFleetPage() {
  const { user } = useAuth();
  const operatorId = user?.operatorId ?? "";
  const { vehicles: liveVehicles } = useSupabaseCollections();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | FleetCategory>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!operatorId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVehicles(
      liveVehicles.filter((vehicle) => vehicle.operatorId === operatorId),
    );
  }, [operatorId, liveVehicles]);

  const openAdd = () => {
    setEditingVehicle(null);
    setDialogOpen(true);
  };
  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleSubmit = async (vehicle: Vehicle) => {
    const scoped: Vehicle = { ...vehicle, operatorId };
    console.log("[partner/fleet] handleSubmit", { scoped, operatorId });
    try {
      const saved = await upsertVehicle(createSupabaseBrowserClient(), scoped);
      setVehicles((prev) => {
        const exists = prev.some((v) => v.id === saved.id);
        return exists
          ? prev.map((v) => (v.id === saved.id ? saved : v))
          : [saved, ...prev];
      });
    } catch (e) {
      window.alert((e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("[partner/fleet] handleDelete", id);
    const ok = await deleteVehicle(createSupabaseBrowserClient(), id);
    if (ok) setVehicles((prev) => prev.filter((v) => v.id !== id));
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

  return (
    <RouteGuard allow={["partner"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Your fleet"
            subtitle="Add vehicles, set rates for each service, upload photos."
          />
          <Button type="button" onClick={openAdd} className="rounded-full">
            <Plus className="size-4" /> Add vehicle
          </Button>
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
                  <TableHead>Airport</TableHead>
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
                            categoryBadge[vehicle.fleetCategory],
                          )}
                        >
                          {vehicle.fleetCategory}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.capacity} pax</TableCell>
                      <TableCell>{formatPrice(vehicle.halfDayPrice)}</TableCell>
                      <TableCell>{formatPrice(vehicle.fullDayPrice)}</TableCell>
                      <TableCell>
                        {formatPrice(vehicle.transferPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
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
                      colSpan={7}
                      className="text-center text-sm text-muted-foreground"
                    >
                      {vehicles.length
                        ? "No vehicles match these filters."
                        : "You haven't added any vehicles yet. Click 'Add vehicle' to get started."}
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
          defaultOperatorId={operatorId}
        />
      </div>
    </RouteGuard>
  );
}
