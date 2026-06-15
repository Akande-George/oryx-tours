"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./client";
import {
  getBookings,
  getDestinations,
  getOperators,
  getReviews,
  getTours,
  getVehicles,
} from "./data";
import type {
  Booking,
  Destination,
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
  ready: boolean;
};

const emptyCollections: Omit<SupabaseCollections, "ready"> = {
  tours: [],
  destinations: [],
  operators: [],
  vehicles: [],
  bookings: [],
  reviews: [],
};

const supabase = createSupabaseBrowserClient();

export function useSupabaseCollections(): SupabaseCollections {
  const [collections, setCollections] = useState<SupabaseCollections>({
    ...emptyCollections,
    ready: false,
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [tours, destinations, operators, vehicles, bookings, reviews] =
        await Promise.all([
          getTours(supabase),
          getDestinations(supabase),
          getOperators(supabase),
          getVehicles(supabase),
          getBookings(supabase),
          getReviews(supabase),
        ]);

      if (!mounted) return;

      setCollections({
        tours,
        destinations,
        operators,
        vehicles,
        bookings,
        reviews,
        ready: true,
      });
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return collections;
}
