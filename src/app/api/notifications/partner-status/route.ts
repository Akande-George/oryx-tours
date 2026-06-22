import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { partnerStatusUpdate } from "@/lib/email/templates";

export async function POST(req: Request) {
  let body: { profileId?: string; status?: "active" | "rejected" };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.profileId || !body.status) {
    return NextResponse.json(
      { error: "profileId and status are required" },
      { status: 400 },
    );
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("name, email, role")
      .eq("id", body.profileId)
      .maybeSingle();

    const profile = data as
      | { name?: string; email?: string; role?: string }
      | null;
    if (!profile?.email || profile.role !== "partner") {
      return NextResponse.json({ ok: true });
    }

    const result = await sendEmail({
      to: profile.email,
      ...partnerStatusUpdate({
        partnerName: profile.name ?? "",
        status: body.status,
      }),
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[partner-status] failed", e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 },
    );
  }
}
