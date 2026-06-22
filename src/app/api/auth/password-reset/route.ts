import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { passwordReset } from "@/lib/email/templates";

const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !isEmail(email)) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 },
    );
  }

  // Don't leak whether an account exists — always return a generic success
  // so we don't enable email enumeration. We log internally if no user.
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${appUrl}/auth/reset-password`,
      },
    });

    if (error) {
      // Common: "User not found" — swallow into generic response.
      console.warn("[password-reset] generateLink:", error.message);
      return NextResponse.json({ ok: true });
    }

    const actionLink = data?.properties?.action_link;
    if (!actionLink) {
      console.error("[password-reset] generateLink returned no action_link");
      return NextResponse.json({ ok: true });
    }

    const result = await sendEmail({
      to: email,
      ...passwordReset({ email, resetUrl: actionLink }),
    });

    if (!result.ok) {
      console.error("[password-reset] Resend failed:", result.error);
      return NextResponse.json(
        { error: `Couldn't send email: ${result.error}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[password-reset] failed", e);
    return NextResponse.json(
      { error: (e as Error).message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
