import { NextResponse } from "next/server";

// Diagnostic only: reports WHICH server env vars the running function can see.
// Returns booleans + a short masked fingerprint - never the actual secret.
// Delete this route once the env issue is resolved.
export const dynamic = "force-dynamic";

const mask = (v?: string) =>
  v ? `set (${v.length} chars, ends "${v.slice(-4)}")` : "MISSING";

export async function GET() {
  return NextResponse.json({
    runtime: "ok",
    RESEND_API_KEY: mask(process.env.RESEND_API_KEY),
    RESEND_FROM: mask(process.env.RESEND_FROM),
    SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
