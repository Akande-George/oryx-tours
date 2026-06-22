import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { vehiclePublished } from "@/lib/email/templates";
import type { Vehicle } from "@/types";

type Body = { vehicleId?: string; isNew?: boolean };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.vehicleId) {
    return NextResponse.json({ error: "vehicleId required" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: vehicleRow } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", body.vehicleId)
      .maybeSingle();
    const vehicle = vehicleRow as Vehicle | null;
    if (!vehicle) {
      return NextResponse.json({ ok: true });
    }

    if (!vehicle.operatorId) {
      return NextResponse.json({ ok: true });
    }

    const admin = createSupabaseAdminClient();
    const { data: partnerRow } = await admin
      .from("profiles")
      .select("name, email")
      .eq("operatorId", vehicle.operatorId)
      .eq("role", "partner")
      .maybeSingle();
    const partner = partnerRow as { name?: string; email?: string } | null;
    if (!partner?.email) {
      return NextResponse.json({ ok: true });
    }

    const result = await sendEmail({
      to: partner.email,
      ...vehiclePublished({
        vehicle,
        partnerFirstName: (partner.name ?? "").split(" ")[0] ?? "",
        isNew: body.isNew ?? true,
      }),
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[vehicle-saved] failed", e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 },
    );
  }
}
