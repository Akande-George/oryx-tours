import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import { welcome } from "@/lib/email/templates";
import type { UserRole } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { email?: string; name?: string; role?: UserRole };
  try {
    body = (await req.json()) as {
      email?: string;
      name?: string;
      role?: UserRole;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }
  const result = await sendEmail({
    to: body.email,
    ...welcome({ name: body.name ?? "", role: body.role ?? "customer" }),
  });
  return NextResponse.json(result);
}
