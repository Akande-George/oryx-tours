import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/atoms";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  variant?: "hero" | "compact";
  className?: string;
};

export function SearchBar({ variant = "hero", className }: SearchBarProps) {
  return (
    <div
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
            className="border-0 bg-transparent px-0 focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-input bg-white/80 px-3 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Dates"
            className="border-0 bg-transparent px-0 focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-input bg-white/80 px-3 py-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Guests"
            className="border-0 bg-transparent px-0 focus-visible:ring-0"
          />
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <p className="text-sm text-muted-foreground">
          Curated for private, refined travel experiences.
        </p>
        <Link
          href="/tours"
          className={buttonVariants({ className: "rounded-full px-6" })}
        >
          Search experiences
        </Link>
      </div>
    </div>
  );
}
