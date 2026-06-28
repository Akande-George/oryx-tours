import "server-only";

const RESEND_API = "https://api.resend.com/emails";

export type EmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  bcc?: string | string[];
};

export type EmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export const sendEmail = async (args: EmailArgs): Promise<EmailResult> => {
  // Read env vars at call time (not module-load time). Reading them as
  // top-level consts captures whatever was present when the module first
  // loaded - which can be undefined in some serverless/bundling setups even
  // when the variable is configured. Reading per-call is robust.
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM ??
    process.env.RESEND_FROM_EMAIL ??
    "Oryx Group <onboarding@resend.dev>";
  const replyTo = process.env.RESEND_REPLY_TO ?? "info@oryxgp.com";

  if (!apiKey) {
    console.warn(
      "[resend] RESEND_API_KEY not set - skipping email",
      args.subject,
    );
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.isArray(args.to) ? args.to : [args.to],
        bcc: args.bcc,
        reply_to: replyTo,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
      cache: "no-store",
    });

    const json = (await res.json()) as { id?: string; message?: string };
    if (!res.ok || !json.id) {
      const error = json.message ?? `HTTP ${res.status}`;
      console.error("[resend] send failed", { subject: args.subject, error });
      return { ok: false, error };
    }
    return { ok: true, id: json.id };
  } catch (e) {
    const msg = (e as Error).message;
    console.error("[resend] send threw", { subject: args.subject, msg });
    return { ok: false, error: msg };
  }
};
