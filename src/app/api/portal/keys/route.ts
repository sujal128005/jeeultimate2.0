import { guard, keyPepper } from "@/lib/workspace/auth";
import { read, write } from "@/lib/workspace/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Message keys.
 *
 * The server keeps each person's public key, and a copy of their private key
 * that their own browser encrypted with their own code. It cannot open that
 * copy, and it never receives the code in a form that would let it.
 *
 * It does hand out a pepper: a per-person string derived from the server's
 * own secret, which the browser mixes into the code before locking the key.
 * Six digits is only a million guesses, so a stolen database on its own would
 * be worth brute-forcing; with the pepper, the database alone is not enough,
 * because the secret it needs never went into the database.
 */

export async function GET() {
  const check = await guard();
  if ("deny" in check) return check.deny;
  const { session } = check;

  const db = await read();
  const me = db.users.find((u) => u.id === session.id);

  return Response.json({
    pepper: keyPepper(session.id),
    mine: me?.publicJwk ? { publicJwk: me.publicJwk, wrappedPrivate: me.wrappedPrivate, salt: me.keySalt } : null,
    // Public keys are public by definition; everyone needs them to write to
    // each other.
    people: db.users.filter((u) => u.active && u.publicJwk).map((u) => ({ id: u.id, publicJwk: u.publicJwk as string })),
  });
}

export async function POST(request: Request) {
  const check = await guard();
  if ("deny" in check) return check.deny;
  const { session } = check;

  let body: { publicJwk?: string; wrappedPrivate?: string; salt?: string; replace?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  if (!body.publicJwk || !body.wrappedPrivate || !body.salt) {
    return Response.json({ error: "incomplete" }, { status: 400 });
  }

  const result = await write((db) => {
    const user = db.users.find((u) => u.id === session.id);
    if (!user) return { error: "no-user" as const };
    // Replacing a key would orphan every message already written to the old
    // one, so it only happens when there is nothing to lose.
    if (user.publicJwk && !body.replace) return { error: "already-set" as const };

    user.publicJwk = body.publicJwk as string;
    user.wrappedPrivate = body.wrappedPrivate as string;
    user.keySalt = body.salt as string;
    return { ok: true as const };
  });

  if ("error" in result) return Response.json(result, { status: result.error === "already-set" ? 409 : 400 });
  return Response.json({ ok: true });
}
