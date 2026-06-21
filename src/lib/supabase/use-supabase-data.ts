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

export function useSupabaseCollections(): SupabaseCollections {
  const [data, setData] = useState({
    ...emptyCollections,
    ready: false,
  });

  const load = useCallback(async () => {
    const [
      tours,
      destinations,
      operators,
      vehicles,
      bookings,
      reviews,
      categories,
      fleetCategories,
    ] = await Promise.all([
      getTours(supabase),
      getDestinations(supabase),
      getOperators(supabase),
      getVehicles(supabase),
      getBookings(supabase),
      getReviews(supabase),
      getCategories(supabase),
      getFleetCategories(supabase),
    ]);

    setData({
      tours,
      destinations,
      operators,
      vehicles,
      bookings,
      reviews,
      categories,
      fleetCategories,
      ready: true,
    });
  }, []);

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

  // Re-fetch when the tab regains focus or becomes visible so newly
  // added rows in another tab / route show up without a hard refresh.
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
