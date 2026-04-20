"use client";

import { SlidersHorizontal } from "lucide-react";
import { Badge, Button, Input } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchStore } from "@/store/search-store";

const durations = ["Any", "1-2 days", "3-5 days", "6+ days"];
const ratings = [4, 4.5, 5];

export function FiltersPanel() {
  const { filters, setQuery, setCategory, setDuration, setRating, reset } =
    useSearchStore();

  return (
    <div className="space-y-4 rounded-2xl border border-white/60 bg-white/70 p-5 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Filters</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>
      <Input
        placeholder="Search experiences"
        value={filters.query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {["All", "Luxury", "Adventure", "Culture", "Wellness"].map(
            (category) => (
              <Badge
                key={category}
                variant={
                  filters.category === category ? "default" : "secondary"
                }
                className="cursor-pointer rounded-full"
                onClick={() => setCategory(category)}
              >
                {category}
              </Badge>
            ),
          )}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Duration
        </p>
        <Select value={filters.duration} onValueChange={setDuration}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durations.map((duration) => (
              <SelectItem key={duration} value={duration}>
                {duration}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Rating
        </p>
        <div className="flex flex-wrap gap-2">
          {ratings.map((rating) => (
            <Badge
              key={rating}
              variant={filters.rating === rating ? "default" : "secondary"}
              className="cursor-pointer rounded-full"
              onClick={() => setRating(rating)}
            >
              {rating}+ stars
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
