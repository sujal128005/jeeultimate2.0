export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The contact form's delivery route.
 *
 * With CONTACT_TO and RESEND_API_KEY set, a message is emailed to the team,
 * attachments included, and the sender's address becomes the reply-to. With
 * them unset, this answers "not-configured" and the form falls back to opening
 * the visitor's own mail app with everything filled in, so a message still
 * reaches us. Nothing here ever tells a visitor their message was sent when
 * it was not.
 */

const MAX_MESSAGE = 4000;
const MAX_FILES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

const LANES: Record<string, string> = {
  business: "Business",
  counselling: "Counselling question",
  correction: "Correction",
};

export function GET() {
  return Response.json({ ready: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO) });
}

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) if (times.every((t) => now - t > WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export async function POST(request: Request) {
  const to = process.env.CONTACT_TO;
  const key = process.env.RESEND_API_KEY;
  if (!to || !key) return Response.json({ error: "not-configured" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return Response.json({ error: "slow-down" }, { status: 429 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const lane = String(form.get("lane") ?? "");
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const topic = String(form.get("topic") ?? "").trim();

  if (!LANES[lane]) return Response.json({ error: "bad-request" }, { status: 400 });
  if (!looksLikeEmail(email)) return Response.json({ error: "bad-email" }, { status: 400 });
  if (message.length < 10) return Response.json({ error: "short-message" }, { status: 400 });

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return Response.json({ error: "too-many-files" }, { status: 400 });
  if (files.some((f) => f.size > MAX_FILE_BYTES)) return Response.json({ error: "file-too-large" }, { status: 400 });

  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()).toString("base64"),
    })),
  );

  const subject = `${LANES[lane]}${topic ? `: ${topic}` : ""} from ${email}`;
  const html = [
    `<p><strong>Lane:</strong> ${escapeHtml(LANES[lane])}</p>`,
    topic ? `<p><strong>About:</strong> ${escapeHtml(topic)}</p>` : "",
    `<p><strong>From:</strong> ${escapeHtml(email)}</p>`,
    `<hr /><p>${escapeHtml(message.slice(0, MAX_MESSAGE)).replace(/\n/g, "<br />")}</p>`,
  ].join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "JEE Ultimate 2.0 <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject,
        html,
        ...(attachments.length ? { attachments } : {}),
      }),
    });
    if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
