import type { Metadata } from "next";
import { WarRoom } from "@/components/portal/WarRoom";
import { ROOM } from "@/config/room";
import { requireSession } from "@/lib/workspace/auth";
import { read } from "@/lib/workspace/store";
import "@/styles/room.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: ROOM.name,
  robots: { index: false, follow: false },
};

export default async function MessagesPage() {
  const session = await requireSession();
  const db = await read();

  // Only what this person is entitled to see leaves the server, and even that
  // is ciphertext: the readable version exists only in their browser.
  const mine = db.messages.filter((m) => m.toId === null || m.toId === session.id || m.fromId === session.id);
  const people = db.users
    .filter((u) => u.active)
    .map((u) => ({ id: u.id, name: u.name, role: u.role, avatarId: u.avatarId, about: u.about }));
  const me = db.users.find((u) => u.id === session.id);

  return (
    <WarRoom me={{ ...session, avatarId: me?.avatarId ?? null, about: me?.about ?? null }} people={people} messages={mine} />
  );
}
