import { randomUUID } from "node:crypto";
import { guard } from "@/lib/workspace/auth";
import { logEvent, saveUpload, write } from "@/lib/workspace/store";
import type { Attachment, Message, Sealed } from "@/lib/workspace/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Send a message to one person or to everyone, with files attached.
 *
 * This is the part that used to happen in a chat group, moved next to the
 * records it is about, so a screenshot of a choice list is not three apps away
 * from the student it belongs to.
 */

const MAX_BODY = 12_000;
const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const OK_TYPES =
  /^(image\/(png|jpeg|jpg|gif|webp|avif)|application\/pdf|text\/plain|text\/csv|application\/vnd\.openxmlformats-officedocument\..+|application\/msword|application\/vnd\.ms-excel)$/;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, number[]>();

function rateLimited(userId: string) {
  const now = Date.now();
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(userId, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const check = await guard();
  if ("deny" in check) return check.deny;
  const { session } = check;

  if (rateLimited(session.id)) return Response.json({ error: "slow-down" }, { status: 429 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const to = String(form.get("to") ?? "ALL");
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  // The browser has already locked everything. What arrives here is an
  // envelope: ciphertext, plus the message key wrapped once per reader.
  let envelope: { senderPublicJwk?: string; body?: Sealed | null; keys?: { userId: string; iv: string; data: string }[] };
  let fileIvs: string[];
  let fileNames: { name: string; type: string; size: number }[];
  try {
    envelope = JSON.parse(String(form.get("envelope") ?? "{}"));
    fileIvs = JSON.parse(String(form.get("fileIvs") ?? "[]"));
    fileNames = JSON.parse(String(form.get("fileNames") ?? "[]"));
  } catch {
    return Response.json({ error: "bad-envelope" }, { status: 400 });
  }

  const senderPublicJwk = envelope.senderPublicJwk;
  const wrappedKeys = envelope.keys;
  if (!senderPublicJwk || !Array.isArray(wrappedKeys) || wrappedKeys.length === 0) {
    return Response.json({ error: "bad-envelope" }, { status: 400 });
  }
  if (!envelope.body && files.length === 0) return Response.json({ error: "empty" }, { status: 400 });
  if (envelope.body && envelope.body.data.length > MAX_BODY) return Response.json({ error: "too-long" }, { status: 400 });
  if (files.length !== fileIvs.length || files.length !== fileNames.length) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  if (files.length > MAX_FILES) return Response.json({ error: "too-many-files" }, { status: 400 });
  if (files.some((f) => f.size > MAX_FILE_BYTES)) return Response.json({ error: "file-too-large" }, { status: 400 });
  // Encrypted bytes carry no type of their own, so the declared type is
  // checked instead, and it is locked inside the envelope as well.
  if (fileNames.some((f) => !OK_TYPES.test(f.type))) return Response.json({ error: "file-type" }, { status: 400 });

  const attachments: Attachment[] = [];
  for (let i = 0; i < files.length; i++) {
    const id = randomUUID();
    await saveUpload(id, Buffer.from(await files[i].arrayBuffer()));
    const meta = fileNames[i];
    attachments.push({
      id,
      name: String(meta.name ?? "attachment").slice(0, 120),
      type: String(meta.type ?? "application/octet-stream"),
      size: Number(meta.size) || files[i].size,
      isImage: String(meta.type ?? "").startsWith("image/"),
      iv: String(fileIvs[i] ?? ""),
    });
  }

  const created = await write((db) => {
    const recipient = to === "ALL" ? null : db.users.find((u) => u.id === to && u.active);
    if (to !== "ALL" && !recipient) return { error: "unknown-recipient" as const };

    const message: Message = {
      id: randomUUID(),
      fromId: session.id,
      fromName: session.name,
      toId: recipient ? recipient.id : null,
      toName: recipient ? recipient.name : null,
      body: envelope.body ?? null,
      senderPublicJwk,
      keys: wrappedKeys,
      attachments,
      createdAt: new Date().toISOString(),
      readBy: [session.id],
    };
    db.messages.unshift(message);
    if (db.messages.length > 2000) db.messages.length = 2000;

    logEvent(
      db,
      session,
      "message",
      null,
      `Message to ${recipient ? recipient.name : "everyone"}${attachments.length ? ` with ${attachments.length} file(s)` : ""}`,
    );
    return { message };
  });

  if ("error" in created) return Response.json(created, { status: 400 });
  return Response.json({ message: created.message });
}
