import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthProfile, AccountStatus } from "@/lib/auth";
import type {
  Booking,
  BookingStatus,
  Category,
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

export const getCategories = (client: SupabaseClient) =>
  readCollection<Category>(client, "categories", "categories");

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

export const updateProfile = async (
  client: SupabaseClient,
  id: string,
  patch: Partial<Pick<AuthProfile, "name" | "companyName">>,
) => {
  const { data, error } = await client
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Failed to update profile ${id}`, error);
    throw new Error(formatSupabaseError("Failed to update profile", error));
  }

  return data as AuthProfile;
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

const formatSupabaseError = (
  label: string,
  err: { message?: string; details?: string; hint?: string; code?: string },
) => {
  const parts = [err.message, err.details, err.hint].filter(Boolean);
  const summary = parts.length ? parts.join(" — ") : "Unknown error";
  return `${label}: ${summary}${err.code ? ` (code ${err.code})` : ""}`;
};

const upsertRow = async <T extends { id: string }>(
  client: SupabaseClient,
  table: string,
  row: T,
  label: string,
): Promise<T> => {
  console.log(`[supabase] upsert ${label}`, row);
  const { data, error } = await client
    .from(table)
    .upsert(row)
    .select()
    .single();

  console.log(`[supabase] upsert ${label} result`, { data, error });

  if (error) {
    console.error(`Failed to upsert ${label} ${row.id}`, error);
    throw new Error(formatSupabaseError(`Failed to save ${label}`, error));
  }

  return data as T;
};

const deleteRow = async (
  client: SupabaseClient,
  table: string,
  id: string,
  label: string,
) => {
  const { error } = await client.from(table).delete().eq("id", id);

  if (error) {
    console.error(`Failed to delete ${label} ${id}`, error);
    throw new Error(formatSupabaseError(`Failed to delete ${label}`, error));
  }
};

export const upsertTour = (client: SupabaseClient, tour: Tour) =>
  upsertRow<Tour>(client, "tours", tour, "tour");

export const deleteTour = (client: SupabaseClient, id: string) =>
  deleteRow(client, "tours", id, "tour");

export const upsertVehicle = (client: SupabaseClient, vehicle: Vehicle) =>
  upsertRow<Vehicle>(client, "vehicles", vehicle, "vehicle");

export const upsertCategory = (client: SupabaseClient, category: Category) =>
  upsertRow<Category>(client, "categories", category, "category");

export const deleteCategory = (client: SupabaseClient, id: string) =>
  deleteRow(client, "categories", id, "category");

export const createBooking = async (
  client: SupabaseClient,
  booking: Booking,
) => {
  const { data, error } = await client
    .from("bookings")
    .insert(booking)
    .select()
    .single();

  if (error) {
    console.error(`Failed to create booking`, error);
    throw new Error(formatSupabaseError("Failed to create booking", error));
  }

  return data as Booking;
};

export const updateBookingStatus = async (
  client: SupabaseClient,
  id: string,
  status: BookingStatus,
) => {
  const { error } = await client
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error(`Failed to update booking ${id}`, error);
    throw new Error(formatSupabaseError("Failed to update booking", error));
  }
};
