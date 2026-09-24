import { randomUUID } from "node:crypto";
import { guard } from "@/lib/workspace/auth";
import { saveUpload, write } from "@/lib/workspace/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const OK_IMAGE = /^image\/(png|jpeg|jpg|webp|gif|avif)$/;

/** Your own picture and one line about yourself. Nobody else can change them. */
export async function POST(request: Request) {
  const check = await guard();
  if ("deny" in check) return check.deny;
  const { session } = check;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const about = String(form.get("about") ?? "")
    .trim()
    .slice(0, 140);
  const removeAvatar = String(form.get("removeAvatar") ?? "") === "1";
  const file = form.get("avatar");

  let avatarId: string | null | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_AVATAR_BYTES) return Response.json({ error: "too-large" }, { status: 400 });
    if (!OK_IMAGE.test(file.type)) return Response.json({ error: "file-type" }, { status: 400 });
    avatarId = randomUUID();
    await saveUpload(avatarId, Buffer.from(await file.arrayBuffer()));
  } else if (removeAvatar) {
    avatarId = null;
  }

  const result = await write((db) => {
    const user = db.users.find((u) => u.id === session.id);
    if (!user) return { error: "no-user" as const };
    user.about = about || null;
    if (avatarId !== undefined) user.avatarId = avatarId;
    return { ok: true as const, avatarId: user.avatarId, about: user.about };
  });

  if ("error" in result) return Response.json(result, { status: 400 });
  return Response.json(result);
}
