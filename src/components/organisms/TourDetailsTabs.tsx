"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/atoms";
import { ReviewCard } from "@/components/molecules/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Review } from "@/types";

const allowedTabs = ["overview", "itinerary", "reviews"] as const;

type AllowedTab = (typeof allowedTabs)[number];

type TourDetailsTabsProps = {
  highlights: string[];
  tags: string[];
  reviews: Review[];
  defaultTab?: AllowedTab;
};

export function TourDetailsTabs({
  highlights,
  tags,
  reviews,
  defaultTab = "overview",
}: TourDetailsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("tab");
  const value = useMemo<AllowedTab>(() => {
    if (allowedTabs.includes(current as AllowedTab)) {
      return current as AllowedTab;
    }
    return defaultTab;
  }, [current, defaultTab]);

  const handleValueChange = (nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextValue);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={value} onValueChange={handleValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <p className="text-sm text-muted-foreground">{highlights.join(" ")}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="itinerary" className="space-y-3 text-sm">
        {highlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-xl border border-border bg-muted/40 p-4"
          >
            {highlight}
          </div>
        ))}
      </TabsContent>
      <TabsContent value="reviews" className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </TabsContent>
    </Tabs>
  );
}
