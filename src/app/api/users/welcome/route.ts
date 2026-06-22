import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import { partnerApplicationAlert, welcome } from "@/lib/email/templates";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/auth";

export async function POST(req: Request) {
  let body: {
    email?: string;
    name?: string;
    role?: UserRole;
    userId?: string;
    companyName?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const role: UserRole = body.role ?? "customer";

  // 1. Welcome / application-received email to the new user
  const welcomeResult = await sendEmail({
    to: body.email,
    ...welcome({ name: body.name ?? "", role }),
  });

  // 2. If this is a partner application, alert every admin so they can review
  if (role === "partner") {
    try {
      const admin = createSupabaseAdminClient();
      const { data: admins } = await admin
        .from("profiles")
        .select("email")
        .eq("role", "admin");

      const adminEmails = (admins ?? [])
        .map((row) => (row as { email?: string }).email)
        .filter((e): e is string => typeof e === "string" && e.length > 0);

      if (adminEmails.length) {
        await sendEmail({
          to: adminEmails,
          ...partnerApplicationAlert({
            applicantName: body.name ?? body.email,
            applicantEmail: body.email,
            companyName: body.companyName,
            applicationId: body.userId ?? body.email,
          }),
        });
      }
    } catch (e) {
      console.error("[welcome] admin alert failed", e);
    }
  }

  return NextResponse.json(welcomeResult);
}
