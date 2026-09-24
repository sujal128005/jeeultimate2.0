import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { read } from "./store";
import type { Role, User } from "./types";

/**
 * Sessions are a signed cookie, nothing more: the user id and an expiry,
 * stamped with an HMAC the browser cannot forge. No token table to keep, and
 * changing WORKSPACE_SECRET signs everyone out at once.
 */

export const SESSION_COOKIE = "ju_workspace";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  const value = process.env.WORKSPACE_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("WORKSPACE_SECRET must be set, and at least 16 characters, in production");
  }
  return "development-only-workspace-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/**
 * A per-person string the browser mixes into their six-digit code before it
 * locks their message key. It comes from the server's secret, so it is not in
 * the database, and it is only handed to someone already signed in as that
 * person. Changing WORKSPACE_SECRET therefore also makes every existing
 * message key unopenable, which is the same blast radius as signing everyone
 * out, and has to be treated that way.
 */
export function keyPepper(userId: string) {
  return createHmac("sha256", secret()).update(`keypepper:${userId}`).digest("base64url");
}

export function issueSession(userId: string) {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expires}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: MAX_AGE_SECONDS };
}

function openSession(token: string | undefined) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expires, mac] = parts;
  const expected = sign(`${userId}.${expires}`);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) < Date.now()) return null;
  return userId;
}

export type Session = Pick<User, "id" | "name" | "email" | "role">;

/** The signed-in user, or null. Reads the store, so it is always current. */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const userId = openSession(jar.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  const db = await read();
  const user = db.users.find((u) => u.id === userId && u.active);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

/** For pages. Sends anyone without a session to the sign-in screen. */
export async function requireSession(allowed?: readonly Role[]): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/portal/signin");
  if (allowed && !allowed.includes(session.role)) redirect("/portal");
  return session;
}

/** For route handlers. Returns a response to send back, or the session. */
export async function guard(allowed?: readonly Role[]): Promise<{ session: Session } | { deny: Response }> {
  const session = await getSession();
  if (!session) return { deny: Response.json({ error: "signed-out" }, { status: 401 }) };
  if (allowed && !allowed.includes(session.role)) {
    return { deny: Response.json({ error: "forbidden" }, { status: 403 }) };
  }
  return { session };
}
