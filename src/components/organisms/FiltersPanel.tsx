"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Badge, Button, Input } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchStore } from "@/store/search-store";

const categories = [
  "All",
  "Luxury",
  "Adventure",
  "Culture",
  "Wellness",
  "Sports",
  "Medical",
];
const durations = ["Any", "1-2 days", "3-5 days", "6+ days"];
const ratings = [
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" },
  { value: 5, label: "5 stars" },
];

export function FiltersPanel() {
  const { filters, setQuery, setCategory, setDuration, setRating, reset } =
    useSearchStore();

  return (
    <div className="space-y-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-input bg-white/80 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search experiences"
            value={filters.query}
            onChange={(event) => setQuery(event.target.value)}
            className="border-0 bg-transparent px-0 focus-visible:ring-0"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-none lg:items-center">
          <Select value={filters.duration} onValueChange={setDuration}>
            <SelectTrigger className="lg:w-[160px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(filters.rating)}
            onValueChange={(value) => setRating(Number(value))}
          >
            <SelectTrigger className="lg:w-[150px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map((rating) => (
                <SelectItem key={rating.value} value={String(rating.value)}>
                  {rating.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="col-span-2 justify-center sm:col-span-1"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Category
        </p>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={filters.category === category ? "default" : "secondary"}
            className="cursor-pointer rounded-full"
            onClick={() => setCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
