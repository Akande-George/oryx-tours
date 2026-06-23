import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import {
  personalizedRequestConcierge,
  personalizedRequestCustomer,
  type PersonalizedRequestEmailArgs,
} from "@/lib/email/templates";
import type { PersonalizedRequest } from "@/types";

const CONCIERGE_EMAIL = process.env.CONCIERGE_EMAIL ?? "info@oryxgp.com";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

type Body = Omit<PersonalizedRequest, "id" | "status" | "createdAt">;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body.name?.trim() ||
    !body.email?.trim() ||
    !isEmail(body.email) ||
    !body.destination?.trim()
  ) {
    return NextResponse.json(
      { error: "Name, a valid email, and destination are required" },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();

  const record = {
    destination: body.destination.trim(),
    startDate: body.startDate ?? "",
    endDate: body.endDate ?? null,
    partySize: body.partySize ?? 1,
    experiences: body.experiences ?? [],
    budget: body.budget ?? "",
    budgetAmount: body.budgetAmount ?? null,
    pace: body.pace ?? "",
    lodging: body.lodging ?? "",
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone ?? null,
    notes: body.notes ?? null,
    status: "new" as const,
  };

  const { data, error } = await admin
    .from("personalized_requests")
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error("[personalized] insert failed", error);
    return NextResponse.json(
      { error: `Could not save request: ${error.message}` },
      { status: 500 },
    );
  }

  // Fire both emails — don't fail the request if email delivery hiccups.
  const emailArgs: PersonalizedRequestEmailArgs = {
    name: record.name,
    email: record.email,
    destination: record.destination,
    startDate: record.startDate,
    endDate: record.endDate ?? undefined,
    partySize: record.partySize,
    experiences: record.experiences,
    budget: record.budget,
    budgetAmount: record.budgetAmount ?? undefined,
    pace: record.pace,
    lodging: record.lodging,
    phone: record.phone ?? undefined,
    notes: record.notes ?? undefined,
  };

  try {
    await Promise.all([
      sendEmail({
        to: record.email,
        ...personalizedRequestCustomer(emailArgs),
      }),
      sendEmail({
        to: CONCIERGE_EMAIL,
        ...personalizedRequestConcierge(emailArgs),
      }),
    ]);
  } catch (e) {
    console.error("[personalized] email dispatch failed", e);
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
