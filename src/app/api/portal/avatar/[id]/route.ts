import { guard } from "@/lib/workspace/auth";
import { read, readUpload } from "@/lib/workspace/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A picture, to anyone signed in. Only ids that a person actually set. */
export async function GET(_request: Request, ctx: RouteContext<"/api/portal/avatar/[id]">) {
  const check = await guard();
  if ("deny" in check) return check.deny;
  const { id } = await ctx.params;

  const db = await read();
  if (!db.users.some((u) => u.avatarId === id)) return new Response("Not found", { status: 404 });

  try {
    const bytes = await readUpload(id);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": "image/*",
        "content-length": String(bytes.length),
        "cache-control": "private, max-age=600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
