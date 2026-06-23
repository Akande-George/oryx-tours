import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

let cached: SupabaseClient | null = null;

export const createSupabaseAdminClient = (): SupabaseClient => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing required env: SUPABASE_SERVICE_ROLE_KEY");
  }
  if (cached) return cached;
  cached = createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
};
