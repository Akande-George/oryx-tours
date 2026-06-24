"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleCard } from "@/components/molecules/VehicleCard";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import type { FleetCategory, Vehicle, VehicleType } from "@/types";

const PAGE_SIZE = 8;

const typeOptions: ("All" | VehicleType)[] = [
  "All",
  "Sedan",
  "SUV",
  "Van",
  "Coach",
  "Pickup",
  "Limousine",
  "Crossover",
  "Other",
];

type FleetBrowserProps = {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (vehicleId: string) => void;
  title?: string;
};

export function FleetBrowser({
  vehicles,
  selectedVehicleId,
  onSelect,
  title = "Browse the fleet",
}: FleetBrowserProps) {
  const { fleetCategories } = useSupabaseCollections(["fleetCategories"]);
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

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | FleetCategory>("All");
  const [vehicleType, setVehicleType] = useState<"All" | VehicleType>("All");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = vehicles.filter((v) => {
      if (category !== "All" && v.fleetCategory !== category) return false;
      if (vehicleType !== "All" && v.vehicleType !== vehicleType) return false;
      if (!needle) return true;
      const haystack = [
        v.name,
        v.fleetCategory,
        v.vehicleType ?? "",
        v.luggage,
        ...v.features,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    // Luxury first: highest "from" price leads, so VIP / premium vehicles
    // surface ahead of economy ones.
    return matched.sort((a, b) => {
      if (b.priceFrom !== a.priceFrom) return b.priceFrom - a.priceFrom;
      return a.name.localeCompare(b.name);
    });
  }, [vehicles, query, category, vehicleType]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
  }, [page, pageCount]);

  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleQuery = (v: string) => {
    setQuery(v);
    setPage(0);
  };

  const handleCategory = (c: "All" | FleetCategory) => {
    setCategory(c);
    setPage(0);
  };

  const handleType = (t: "All" | VehicleType) => {
    setVehicleType(t);
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}
          {category !== "All" ? ` · ${category}` : ""}
          {vehicleType !== "All" ? ` · ${vehicleType}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search vehicle name, type, or feature"
            className="pl-9"
          />
        </div>
        <Select
          value={vehicleType}
          onValueChange={(v) => handleType(v as "All" | VehicleType)}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All types" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleCategory(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              category === option
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              selected={vehicle.id === selectedVehicleId}
              onSelect={() => onSelect(vehicle.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/60 bg-white/60 p-10 text-center text-sm text-muted-foreground">
          No vehicles match this search.
        </div>
      )}

      {pageCount > 1 ? (
        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </Button>
          <p className="text-xs text-muted-foreground">
            Page {page + 1} of {pageCount}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
