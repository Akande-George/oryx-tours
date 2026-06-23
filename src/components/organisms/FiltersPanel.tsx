"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge, Button, Input } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";

const durations = ["Any", "1-2 days", "3-5 days", "6+ days"];
const ratings = [
  { value: 0, label: "Any rating" },
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" },
  { value: 5, label: "5 stars" },
];

export function FiltersPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories: liveCategories } = useSupabaseCollections([
    "categories",
  ]);

  const sortedCategories = useMemo(
    () =>
      [...liveCategories].sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        return a.title.localeCompare(b.title);
      }),
    [liveCategories],
  );

  const [query, setQueryLocal] = useState(searchParams.get("q") ?? "");
  const category = searchParams.get("category") ?? "All";
  const duration = searchParams.get("duration") ?? "Any";
  const rating = Number(searchParams.get("rating") ?? "0");

  // Debounced query → URL
  useEffect(() => {
    const t = window.setTimeout(() => {
      pushParams({ q: query || null });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const pushParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    router.push(`/tours${qs ? `?${qs}` : ""}`);
  };

  const reset = () => {
    setQueryLocal("");
    router.push("/tours");
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-input bg-white/80 px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search experiences"
            value={query}
            onChange={(event) => setQueryLocal(event.target.value)}
            className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-none lg:items-center">
          <Select
            value={duration}
            onValueChange={(v) => pushParams({ duration: v === "Any" ? null : v })}
          >
            <SelectTrigger className="h-9 lg:w-[160px]">
              <SelectValue placeholder="Duration">
                {duration === "Any" ? "Any duration" : duration}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {durations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d === "Any" ? "Any duration" : d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(rating)}
            onValueChange={(v) =>
              pushParams({ rating: v === "0" ? null : v })
            }
          >
            <SelectTrigger className="h-9 lg:w-[160px]">
              <SelectValue placeholder="Rating">
                {ratings.find((r) => r.value === rating)?.label ?? "Any rating"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ratings.map((r) => (
                <SelectItem key={r.value} value={String(r.value)}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="col-span-2 h-9 justify-center sm:col-span-1"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Category
        </p>
        <Badge
          variant={category === "All" ? "default" : "secondary"}
          className="cursor-pointer rounded-full"
          onClick={() => pushParams({ category: null })}
        >
          All
        </Badge>
        {sortedCategories.map((c) => (
          <Badge
            key={c.id}
            variant={category === c.title ? "default" : "secondary"}
            className="cursor-pointer rounded-full"
            onClick={() => pushParams({ category: c.title })}
          >
            {c.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}
