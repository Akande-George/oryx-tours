import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: ReturnType<typeof createClient> | null = null;

export const createSupabaseAdminClient = () => {
  if (!serviceRoleKey) {
    throw new Error("Missing required env: SUPABASE_SERVICE_ROLE_KEY");
  }
  if (cached) return cached;
  cached = createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
};
