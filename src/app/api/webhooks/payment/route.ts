import { createHmac, timingSafeEqual } from "node:crypto";
import { blankEnrolment, write } from "@/lib/workspace/store";
import { CATEGORIES, GENDERS, type Category, type Gender } from "@/lib/workspace/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Razorpay tells us a payment succeeded.
 *
 * This, not the browser redirect, is what creates a student in the workspace.
 * Someone who pays and closes the tab straight after must still appear, which
 * is the whole reason students used to get missed.
 *
 * Razorpay retries a webhook it thinks failed, so the same event will arrive
 * more than once. The payment id is the key, and a second delivery updates the
 * same row instead of making a new one.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const hits: number[] = [];

function rateLimited() {
  const now = Date.now();
  while (hits.length && now - hits[0] > WINDOW_MS) hits.shift();
  hits.push(now);
  return hits.length > MAX_PER_WINDOW;
}

function signatureMatches(raw: string, header: string | null, secret: string) {
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(header, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

const asCategory = (value: unknown): Category => {
  const text = String(value ?? "")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  return (CATEGORIES as readonly string[]).includes(text) ? (text as Category) : "UNKNOWN";
};

const asGender = (value: unknown): Gender => {
  const text = String(value ?? "").toUpperCase();
  if (text.startsWith("M")) return "MALE";
  if (text.startsWith("F")) return "FEMALE";
  return (GENDERS as readonly string[]).includes(text) ? (text as Gender) : "UNDISCLOSED";
};

const asRank = (value: unknown): number | null => {
  const n = Number(String(value ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

type RazorpayEntity = {
  id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  created_at?: number;
  email?: string;
  contact?: string;
  notes?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "not-configured" }, { status: 503 });
  if (rateLimited()) return Response.json({ error: "slow-down" }, { status: 429 });

  // The signature covers the exact bytes sent, so read the body as text first
  // and parse only after it checks out.
  const raw = await request.text();
  if (!signatureMatches(raw, request.headers.get("x-razorpay-signature"), secret)) {
    return Response.json({ error: "bad-signature" }, { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: RazorpayEntity } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }

  // Anything other than a captured payment is acknowledged and ignored, so
  // Razorpay stops retrying it.
  if (event.event !== "payment.captured") return Response.json({ ok: true, ignored: event.event ?? null });

  const entity = event.payload?.payment?.entity;
  if (!entity?.id) return Response.json({ error: "no-payment" }, { status: 400 });

  const notes = entity.notes ?? {};
  const name = String(notes.name ?? notes.full_name ?? "").trim();
  const email = String(entity.email ?? notes.email ?? "").trim();

  const created = await write((db) => {
    const existing = db.enrolments.find((e) => e.paymentRef === entity.id);
    const fields = {
      orderRef: entity.order_id ?? null,
      amountPaise: typeof entity.amount === "number" ? entity.amount : 0,
      currency: entity.currency ?? "INR",
      paidAt: entity.created_at ? new Date(entity.created_at * 1000).toISOString() : new Date().toISOString(),
      planCode: notes.plan ? String(notes.plan) : null,
      fullName: name || existing?.fullName || "Name not given",
      email: email || existing?.email || "",
      phone: entity.contact ? String(entity.contact) : (existing?.phone ?? null),
      rank: asRank(notes.rank ?? notes.air) ?? existing?.rank ?? null,
      category: notes.category ? asCategory(notes.category) : (existing?.category ?? "UNKNOWN"),
      gender: notes.gender ? asGender(notes.gender) : (existing?.gender ?? "UNDISCLOSED"),
      homeState: notes.state ? String(notes.state) : (existing?.homeState ?? null),
      counselling: notes.counselling ? String(notes.counselling) : (existing?.counselling ?? null),
    };

    if (existing) {
      // A repeat delivery refreshes the details and leaves the assignment,
      // the progress and the status exactly as the team left them.
      Object.assign(existing, fields);
      existing.updatedAt = new Date().toISOString();
      return { id: existing.id, repeat: true };
    }

    const row = blankEnrolment({ paymentRef: entity.id as string, ...fields });
    db.enrolments.unshift(row);
    return { id: row.id, repeat: false };
  });

  return Response.json({ ok: true, ...created });
}
