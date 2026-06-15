const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const requireEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required Supabase environment variable: ${name}`);
  }

  return value;
};

export const getSupabaseUrl = () =>
  requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL");

export const getSupabaseAnonKey = () =>
  requireEnv(supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
