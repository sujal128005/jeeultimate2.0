import { cookies } from "next/headers";
import { issueSession, SESSION_COOKIE } from "@/lib/workspace/auth";
import { verifyPassword } from "@/lib/workspace/password";
import { logEvent, write } from "@/lib/workspace/store";
import { HOME_FOR } from "@/lib/workspace/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A six-digit code is a million guesses, which a machine would run through in
 * seconds if we let it. So the door is slow on purpose: five tries per person
 * and per address in fifteen minutes, and a ceiling across the whole workspace
 * so a spread-out attempt is no faster than a focused one. At five tries a
 * quarter of an hour, working through a million codes takes centuries.
 */
const WINDOW_MS = 15 * 60_000;
const MAX_PER_KEY = 5;
const MAX_OVERALL = 40;

const tries = new Map<string, number[]>();

function recent(key: string) {
  const now = Date.now();
  const list = (tries.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  tries.set(key, list);
  return list;
}

function tooMany(key: string, limit: number) {
  const list = recent(key);
  list.push(Date.now());
  if (tries.size > 2000) {
    const now = Date.now();
    for (const [k, times] of tries) if (times.every((t) => now - t > WINDOW_MS)) tries.delete(k);
  }
  return list.length > limit;
}

export async function POST(request: Request) {
  let body: { userId?: string; pin?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const userId = String(body.userId ?? "").trim();
  const pin = String(body.pin ?? "");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  // Shape is checked before anything is looked up, so a malformed code never
  // costs a scrypt round.
  if (!/^\d{6}$/.test(pin) || userId === "") {
    return Response.json({ error: "no-match" }, { status: 401 });
  }

  if (tooMany(`ip:${ip}`, MAX_PER_KEY) || tooMany(`user:${userId}`, MAX_PER_KEY) || tooMany("all", MAX_OVERALL)) {
    return Response.json({ error: "too-many" }, { status: 429 });
  }

  const outcome = await write((db) => {
    const user = db.users.find((u) => u.id === userId && u.active);
    if (!user || !verifyPassword(pin, user.passwordHash)) return null;
    logEvent(db, user, "signin", null, `Logged in as ${user.role}`);
    return { id: user.id, role: user.role };
  });

  if (!outcome) return Response.json({ error: "no-match" }, { status: 401 });

  // A correct code clears that person's counter, so a mistyped digit earlier
  // in the day never locks someone out of their own workspace.
  tries.delete(`user:${userId}`);

  const session = issueSession(outcome.id);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });

  return Response.json({ ok: true, next: HOME_FOR[outcome.role] });
}
