"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Ticket } from "lucide-react";
import { Badge } from "@/components/atoms";
import { ReviewCard } from "@/components/molecules/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ItineraryItem, Review } from "@/types";

const READ_MORE_LIMIT = 160;

function ItineraryStop({
  item,
  index,
  isLast,
}: {
  item: ItineraryItem;
  index: number;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const detail = item.detail ?? "";
  const isLong = detail.length > READ_MORE_LIMIT;
  const shown =
    expanded || !isLong ? detail : `${detail.slice(0, READ_MORE_LIMIT)} …`;

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {/* connecting line */}
      {!isLast ? (
        <span
          aria-hidden
          className="absolute left-4 top-8 h-[calc(100%-1.5rem)] w-px -translate-x-1/2 bg-border"
        />
      ) : null}
      <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
        {index + 1}
      </span>
      <div className="space-y-1 pt-0.5">
        <p className="font-semibold text-foreground">
          {item.title || `Stop ${index + 1}`}
        </p>
        {detail ? (
          <p className="text-sm text-muted-foreground">
            {shown}
            {isLong ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="ml-1 font-medium text-foreground underline underline-offset-2"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            ) : null}
          </p>
        ) : null}
        {item.duration || item.admission ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            {item.duration ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" /> {item.duration}
              </span>
            ) : null}
            {item.admission ? (
              <span className="inline-flex items-center gap-1">
                <Ticket className="size-3.5" /> {item.admission}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

const allowedTabs = ["overview", "itinerary", "reviews"] as const;

type AllowedTab = (typeof allowedTabs)[number];

type TourDetailsTabsProps = {
  description: string;
  tags: string[];
  itinerary: ItineraryItem[];
  reviews: Review[];
  defaultTab?: AllowedTab;
};

export function TourDetailsTabs({
  description,
  tags,
  itinerary,
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
        <p className="text-base text-muted-foreground">{description}</p>
        {itinerary.length ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {itinerary.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{item.title || `Stop ${index + 1}`}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="itinerary" className="text-sm">
        {itinerary.length ? (
          <ul className="pt-2">
            {itinerary.map((item, index) => (
              <ItineraryStop
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                isLast={index === itinerary.length - 1}
              />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            A detailed itinerary for this experience is coming soon.
          </p>
        )}
      </TabsContent>
      <TabsContent value="reviews" className="grid gap-4 md:grid-cols-2">
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No reviews yet — be the first to experience this tour.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
