"use client";

import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import {
  type ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button, DateInput, Input } from "@/components/atoms";
import { todayISO } from "@/lib/format";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  variant?: "hero" | "compact";
  className?: string;
};

export function SearchBar({ variant = "hero", className }: SearchBarProps) {
  const searchParams = useSearchParams();

  // Remount the inner form when the relevant URL params change so its fields
  // re-initialise from the URL — no setState-in-effect, no cascading renders.
  const syncKey = `${searchParams.get("q") ?? ""}|${searchParams.get("date") ?? ""}|${searchParams.get("guests") ?? ""}`;

  return (
    <SearchBarForm
      key={syncKey}
      variant={variant}
      className={className}
      searchParams={searchParams}
    />
  );
}

function SearchBarForm({
  variant = "hero",
  className,
  searchParams,
}: SearchBarProps & { searchParams: ReadonlyURLSearchParams }) {
  const router = useRouter();

  const [destination, setDestination] = useState(searchParams.get("q") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");
  const [guests, setGuests] = useState(
    Math.max(1, Number(searchParams.get("guests") ?? "2") || 2),
  );

  const handleSearch = () => {
    // Preserve any unrelated params (category, duration, rating)
    const params = new URLSearchParams(searchParams.toString());
    if (destination.trim()) params.set("q", destination.trim());
    else params.delete("q");
    if (date) params.set("date", date);
    else params.delete("date");
    if (guests && guests > 1) params.set("guests", String(guests));
    else params.delete("guests");
    const qs = params.toString();
    router.push(`/tours${qs ? `?${qs}` : ""}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_20px_60px_-32px_rgba(92,70,39,0.5)] backdrop-blur",
        variant === "compact" && "rounded-xl p-3",
        className,
      )}
    >
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-xl border border-input bg-white/80 px-3 py-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border-0 bg-transparent px-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-input bg-white/80 px-3 py-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <DateInput
            min={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            hideIcon
            className="h-auto border-0 bg-transparent px-0 py-0 text-foreground shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-input bg-white/80 px-3 py-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            min={1}
            value={guests}
            onChange={(e) =>
              setGuests(Math.max(1, Number(e.target.value) || 1))
            }
            placeholder="Guests"
            className="border-0 bg-transparent px-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <p className="text-sm text-muted-foreground">
          Curated for private, refined travel experiences.
        </p>
        <Button type="submit" className="rounded-full px-6">
          Search experiences
        </Button>
      </div>
    </form>
  );
}
