"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
] as const;

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "recommended";

  const handleChange = (value: string | null) => {
    const next = value ?? "recommended";
    const params = new URLSearchParams(searchParams.toString());
    if (next === "recommended") params.delete("sort");
    else params.set("sort", next);
    const qs = params.toString();
    router.push(`/tours${qs ? `?${qs}` : ""}`);
  };

  const label =
    OPTIONS.find((o) => o.value === current)?.label ?? "Recommended";

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sort by">{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
