import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthProfile, AccountStatus } from "@/lib/auth";
import type {
  Booking,
  BookingStatus,
  Category,
  Destination,
  FleetCategoryRecord,
  Operator,
  PersonalizedRequest,
  PersonalizedRequestStatus,
  Review,
  Tour,
  Vehicle,
} from "@/types";

const readCollection = async <T>(
  client: SupabaseClient,
  table: string,
  label: string,
  orderColumn: string = "id",
) => {
  // Ordering by a deterministic column (default: id) keeps row positions
  // stable across reads - without it, Postgres is free to return rows in
  // any order, so an UPDATE shuffles items in the UI.
  const { data, error } = await client
    .from(table)
    .select("*")
    .order(orderColumn, { ascending: true });

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

export const getFleetCategories = (client: SupabaseClient) =>
  readCollection<FleetCategoryRecord>(
    client,
    "fleet_categories",
    "fleet categories",
  );

export const getSavedTourSlugs = async (
  client: SupabaseClient,
  customerId: string,
): Promise<string[]> => {
  const { data, error } = await client
    .from("saved_tours")
    .select("tourSlug")
    .eq("customerId", customerId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to load saved tours", error);
    }
    return [];
  }

  return (data ?? []).map((row) => (row as { tourSlug: string }).tourSlug);
};

export const addSavedTour = async (
  client: SupabaseClient,
  customerId: string,
  tourSlug: string,
) => {
  const { error } = await client
    .from("saved_tours")
    .upsert(
      { customerId, tourSlug },
      { onConflict: "customerId,tourSlug" },
    );

  if (error) {
    console.error("Failed to save tour", error);
    throw new Error(formatSupabaseError("Failed to save tour", error));
  }
};

export const removeSavedTour = async (
  client: SupabaseClient,
  customerId: string,
  tourSlug: string,
) => {
  const { error } = await client
    .from("saved_tours")
    .delete()
    .eq("customerId", customerId)
    .eq("tourSlug", tourSlug);

  if (error) {
    console.error("Failed to unsave tour", error);
    throw new Error(formatSupabaseError("Failed to unsave tour", error));
  }
};

export const getPersonalizedRequests = (client: SupabaseClient) =>
  readCollection<PersonalizedRequest>(
    client,
    "personalized_requests",
    "personalized requests",
    "createdAt",
  );

export const updatePersonalizedRequestStatus = async (
  client: SupabaseClient,
  id: string,
  status: PersonalizedRequestStatus,
) => {
  const { error } = await client
    .from("personalized_requests")
    .update({ status })
    .eq("id", id);

  if (error && process.env.NODE_ENV !== "production") {
    console.error(`Failed to update personalized request ${id}`, error);
  }

  return !error;
};

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
  const summary = parts.length ? parts.join(" - ") : "Unknown error";
  return `${label}: ${summary}${err.code ? ` (code ${err.code})` : ""}`;
};

const upsertRow = async <T extends { id: string }>(
  client: SupabaseClient,
  table: string,
  row: T,
  label: string,
): Promise<T> => {
  // Normalize the row before writing:
  //  - drop `undefined` keys (no value to write)
  //  - convert an empty `operatorId` to null so it doesn't trip the FK
  // Everything else - including empty strings and empty arrays - is kept so
  // that editing can clear a field back to empty (e.g. removing a video URL
  // or emptying the itinerary).
  const sanitized = Object.fromEntries(
    Object.entries(row)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => {
        if (k === "operatorId" && (v === "" || v === null)) return [k, null];
        return [k, v];
      }),
  );
  console.log(`[supabase] upsert ${label}`, sanitized);
  // NOTE: use .select() (not .single()). With .single(), a successful write
  // whose row is then hidden by an RLS SELECT policy returns 0 rows and
  // surfaces as an error - making a save that actually persisted look failed.
  const { data, error } = await client
    .from(table)
    .upsert(sanitized)
    .select();

  console.log(`[supabase] upsert ${label} result`, { data, error });

  if (error) {
    console.error(`Failed to upsert ${label} ${row.id}`, error);
    throw new Error(formatSupabaseError(`Failed to save ${label}`, error));
  }

  // If the write succeeded but the select returned nothing (RLS read rules),
  // fall back to the row we just sent so the UI still updates optimistically.
  const saved = (data && data[0]) ?? sanitized;
  return saved as T;
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

export const upsertFleetCategory = (
  client: SupabaseClient,
  category: FleetCategoryRecord,
) =>
  upsertRow<FleetCategoryRecord>(
    client,
    "fleet_categories",
    category,
    "fleet category",
  );

export const deleteFleetCategory = (client: SupabaseClient, id: string) =>
  deleteRow(client, "fleet_categories", id, "fleet category");

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
