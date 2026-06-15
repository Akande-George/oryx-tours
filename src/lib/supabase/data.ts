import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthProfile, AccountStatus } from "@/lib/auth";
import type {
  Booking,
  Destination,
  Operator,
  Review,
  Tour,
  Vehicle,
} from "@/types";

const readCollection = async <T>(
  client: SupabaseClient,
  table: string,
  label: string,
) => {
  const { data, error } = await client.from(table).select("*");

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to load ${label} from Supabase`, error);
    }
    return [] as T[];
  }

  return (data ?? []) as T[];
};

export const getTours = (client: SupabaseClient) =>
  readCollection<Tour>(client, "tours", "tours");

export const getDestinations = (client: SupabaseClient) =>
  readCollection<Destination>(client, "destinations", "destinations");

export const getOperators = (client: SupabaseClient) =>
  readCollection<Operator>(client, "operators", "operators");

export const getVehicles = (client: SupabaseClient) =>
  readCollection<Vehicle>(client, "vehicles", "vehicles");

export const getBookings = (client: SupabaseClient) =>
  readCollection<Booking>(client, "bookings", "bookings");

export const getReviews = (client: SupabaseClient) =>
  readCollection<Review>(client, "reviews", "reviews");

export const getProfiles = (client: SupabaseClient) =>
  readCollection<AuthProfile>(client, "profiles", "profiles");

export const getProfileById = async (client: SupabaseClient, id: string) => {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to load profile ${id} from Supabase`, error);
    }
    return null;
  }

  return (data ?? null) as AuthProfile | null;
};

export const updateProfileStatus = async (
  client: SupabaseClient,
  id: string,
  status: AccountStatus,
) => {
  const { error } = await client
    .from("profiles")
    .update({ status })
    .eq("id", id);

  if (error && process.env.NODE_ENV !== "production") {
    console.error(`Failed to update profile ${id}`, error);
  }

  return !error;
};

export const getTourBySlug = async (client: SupabaseClient, slug: string) => {
  const { data, error } = await client
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to load tour ${slug} from Supabase`, error);
    }
    return null;
  }

  return (data ?? null) as Tour | null;
};

export const getOperatorById = async (
  client: SupabaseClient,
  operatorId: string,
) => {
  const { data, error } = await client
    .from("operators")
    .select("*")
    .eq("id", operatorId)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `Failed to load operator ${operatorId} from Supabase`,
        error,
      );
    }
    return null;
  }

  return (data ?? null) as Operator | null;
};

export const getToursByOperatorId = async (
  client: SupabaseClient,
  operatorId: string,
) => {
  const { data, error } = await client
    .from("tours")
    .select("*")
    .eq("operatorId", operatorId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Failed to load tours for ${operatorId}`, error);
    }
    return [] as Tour[];
  }

  return (data ?? []) as Tour[];
};

export const getBookingsByTourIds = async (
  client: SupabaseClient,
  tourIds: string[],
) => {
  if (!tourIds.length) return [] as Booking[];

  const { data, error } = await client
    .from("bookings")
    .select("*")
    .in("tourId", tourIds);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to load bookings from Supabase", error);
    }
    return [] as Booking[];
  }

  return (data ?? []) as Booking[];
};

export const deleteVehicle = async (client: SupabaseClient, id: string) => {
  const { error } = await client.from("vehicles").delete().eq("id", id);

  if (error && process.env.NODE_ENV !== "production") {
    console.error(`Failed to delete vehicle ${id}`, error);
  }

  return !error;
};
