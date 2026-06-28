"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./client";
import {
  getBookings,
  getCategories,
  getDestinations,
  getFleetCategories,
  getOperators,
  getReviews,
  getTours,
  getVehicles,
} from "./data";
import type {
  Booking,
  Category,
  Destination,
  FleetCategoryRecord,
  Operator,
  Review,
  Tour,
  Vehicle,
} from "@/types";

type SupabaseCollections = {
  tours: Tour[];
  destinations: Destination[];
  operators: Operator[];
  vehicles: Vehicle[];
  bookings: Booking[];
  reviews: Review[];
  categories: Category[];
  fleetCategories: FleetCategoryRecord[];
  ready: boolean;
  refresh: () => Promise<void>;
};

export type CollectionKey = keyof Omit<
  SupabaseCollections,
  "ready" | "refresh"
>;

const ALL_KEYS: CollectionKey[] = [
  "tours",
  "destinations",
  "operators",
  "vehicles",
  "bookings",
  "reviews",
  "categories",
  "fleetCategories",
];

const emptyCollections: Omit<SupabaseCollections, "ready" | "refresh"> = {
  tours: [],
  destinations: [],
  operators: [],
  vehicles: [],
  bookings: [],
  reviews: [],
  categories: [],
  fleetCategories: [],
};

const supabase = createSupabaseBrowserClient();

const fetchers: Record<
  CollectionKey,
  () => Promise<unknown[]>
> = {
  tours: () => getTours(supabase),
  destinations: () => getDestinations(supabase),
  operators: () => getOperators(supabase),
  vehicles: () => getVehicles(supabase),
  bookings: () => getBookings(supabase),
  reviews: () => getReviews(supabase),
  categories: () => getCategories(supabase),
  fleetCategories: () => getFleetCategories(supabase),
};

/**
 * Fetch only the Supabase collections a page actually renders.
 *
 *   const { vehicles, fleetCategories } = useSupabaseCollections([
 *     "vehicles",
 *     "fleetCategories",
 *   ]);
 *
 * Called with no argument it fetches everything (back-compat). Requesting
 * only what you need cuts the number of round-trips per page and shortens
 * the cold-start wait.
 */
export function useSupabaseCollections(
  keys?: CollectionKey[],
): SupabaseCollections {
  // Stabilise the key list so a new inline array each render doesn't loop.
  const requested = keys ?? ALL_KEYS;
  const keySignature = [...requested].sort().join(",");

  const [data, setData] = useState({
    ...emptyCollections,
    ready: false,
  });

  // Derive the active keys from the (stable) signature inside the callback so
  // we never write a ref during render - keySignature is the dependency.
  const load = useCallback(async () => {
    const current = keySignature.split(",") as CollectionKey[];
    const results = await Promise.all(current.map((k) => fetchers[k]()));
    const next: Record<string, unknown[]> = {};
    current.forEach((k, i) => {
      next[k] = results[i];
    });
    setData((prev) => ({ ...prev, ...next, ready: true }) as typeof prev);
  }, [keySignature]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        await load();
      } catch (e) {
        if (mounted) console.error("[collections] load failed", e);
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [load]);

  // Re-fetch when the tab regains focus so newly added rows in another tab /
  // route show up without a hard refresh.
  useEffect(() => {
    const onFocus = () => {
      void load();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  return {
    ...data,
    refresh: load,
  };
}
