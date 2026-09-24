import { guard } from "@/lib/workspace/auth";
import { read, readUpload } from "@/lib/workspace/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serve an attachment, but only to someone the message was sent to. An id on
 * its own is not permission.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/portal/files/[id]">) {
  const check = await guard();
  if ("deny" in check) return check.deny;
  const { session } = check;
  const { id } = await ctx.params;

  const db = await read();
  const message = db.messages.find((m) => m.attachments.some((a) => a.id === id));
  const file = message?.attachments.find((a) => a.id === id);
  if (!message || !file) return new Response("Not found", { status: 404 });

  const allowed = message.toId === null || message.toId === session.id || message.fromId === session.id;
  if (!allowed) return new Response("Not found", { status: 404 });

  try {
    const bytes = await readUpload(id);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": file.type || "application/octet-stream",
        "content-length": String(bytes.length),
        "content-disposition": `${file.isImage ? "inline" : "attachment"}; filename="${file.name.replace(/"/g, "")}"`,
        "cache-control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
