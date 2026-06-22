import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { tourPublished } from "@/lib/email/templates";
import type { Tour } from "@/types";

type Body = { tourId?: string; isNew?: boolean };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.tourId) {
    return NextResponse.json({ error: "tourId required" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: tourRow } = await supabase
      .from("tours")
      .select("*")
      .eq("id", body.tourId)
      .maybeSingle();
    const tour = tourRow as Tour | null;
    if (!tour) {
      return NextResponse.json({ ok: true });
    }

    // Find a partner profile attached to this tour's operator
    const admin = createSupabaseAdminClient();
    if (!tour.operatorId) {
      return NextResponse.json({ ok: true });
    }

    const { data: partnerRow } = await admin
      .from("profiles")
      .select("name, email")
      .eq("operatorId", tour.operatorId)
      .eq("role", "partner")
      .maybeSingle();
    const partner = partnerRow as { name?: string; email?: string } | null;
    if (!partner?.email) {
      return NextResponse.json({ ok: true });
    }

    const result = await sendEmail({
      to: partner.email,
      ...tourPublished({
        tour,
        partnerFirstName: (partner.name ?? "").split(" ")[0] ?? "",
        isNew: body.isNew ?? true,
      }),
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[tour-saved] failed", e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 },
    );
  }
}
