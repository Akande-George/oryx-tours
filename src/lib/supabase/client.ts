import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
};
