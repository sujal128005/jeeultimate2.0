"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ROOM } from "@/config/room";
import {
  createIdentity,
  lockPhrase,
  openBytes,
  openContentKey,
  openText,
  sealMessage,
  unlockIdentity,
  vault,
  type Envelope,
} from "@/lib/workspace/e2ee";
import type { Message, Role } from "@/lib/workspace/types";

const MAX_FILES = 5;
const MAX_MB = 8;

export type Person = { id: string; name: string; role: Role; avatarId: string | null; about: string | null };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

const time = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

const dayOf = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  if (new Date(today.getTime() - 86_400_000).toDateString() === d.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Mark the first message of each day, so the thread can show a date line. */
/**
 * Day separators, plus where each run of messages from one person starts and
 * ends. A phone shows the name once at the top of a run and the tail once at
 * the bottom, not on every bubble, and a thread reads far better for it.
 */
function withDays(rows: Message[]) {
  const out: { message: Message; day: string; first: boolean; startsRun: boolean; endsRun: boolean }[] = [];
  let previousDay = "";
  for (let i = 0; i < rows.length; i++) {
    const m = rows[i];
    const day = dayOf(m.createdAt);
    const newDay = day !== previousDay;
    const before = newDay ? undefined : rows[i - 1];
    const after = rows[i + 1];
    const sameDayAfter = after && dayOf(after.createdAt) === day;
    out.push({
      message: m,
      day,
      first: newDay,
      startsRun: !before || before.fromId !== m.fromId,
      endsRun: !after || !sameDayAfter || after.fromId !== m.fromId,
    });
    previousDay = day;
  }
  return out;
}

function Avatar({ person, size = 24 }: { person: { name: string; avatarId: string | null }; size?: number }) {
  return (
    <span className="wr-avatar" style={{ width: size, height: size, fontSize: size < 30 ? 10.5 : 14 }}>
      {person.avatarId ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={`/api/portal/avatar/${person.avatarId}`} alt="" className="wr-photo" />
      ) : (
        initials(person.name)
      )}
    </span>
  );
}

export function WarRoom({
  me,
  people,
  messages,
}: {
  me: { id: string; name: string; role: Role; avatarId: string | null; about: string | null };
  people: Person[];
  messages: Message[];
}) {
  const router = useRouter();
  const [privateJwk, setPrivateJwk] = useState<JsonWebKey | null>(null);
  const [myPublicJwk, setMyPublicJwk] = useState<string | null>(null);
  const [publicKeys, setPublicKeys] = useState<Record<string, string>>({});
  const [needsKey, setNeedsKey] = useState<"loading" | "new" | "unlock" | "ready">("loading");
  const [password, setPassword] = useState("");
  const [keyProblem, setKeyProblem] = useState<string | null>(null);
  /** Bumped after a key is created, to pick the new public keys back up. */
  const [keyRound, setKeyRound] = useState(0);

  const [room, setRoom] = useState<string>("ALL");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [opened, setOpened] = useState<Record<string, { text: string | null; images: Record<string, string> }>>({});
  const [profileOpen, setProfileOpen] = useState(false);

  const [pepper, setPepper] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---- keys ------------------------------------------------------------- */

  /** What keys exist, and whether this tab already holds ours. */
  useEffect(() => {
    let alive = true;

    async function look() {
      const res = await fetch("/api/portal/keys");
      if (!res.ok || !alive) return;
      const data = (await res.json()) as {
        pepper: string;
        mine: { publicJwk: string; wrappedPrivate: string; salt: string } | null;
        people: { id: string; publicJwk: string }[];
      };
      if (!alive) return;
      setPepper(data.pepper);
      setPublicKeys(Object.fromEntries(data.people.map((p) => [p.id, p.publicJwk])));
      setMyPublicJwk(data.mine?.publicJwk ?? null);

      const held = vault.get();
      if (data.mine && held) {
        setPrivateJwk(held);
        setNeedsKey("ready");
      } else {
        setNeedsKey(data.mine ? "unlock" : "new");
      }
    }

    void look();
    return () => {
      alive = false;
    };
  }, [keyRound]);

  const setUpKey = async () => {
    setKeyProblem(null);
    if (!/^\d{6}$/.test(password)) {
      setKeyProblem("Type the six-digit code you log in with.");
      return;
    }
    if (!pepper) {
      setKeyProblem("Still loading. Try again in a second.");
      return;
    }
    const { identity, privateJwk: fresh } = await createIdentity(lockPhrase(password, pepper));
    const res = await fetch("/api/portal/keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(identity),
    });
    if (!res.ok) {
      setKeyProblem("Could not save your key. Reload and try again.");
      return;
    }
    vault.put(fresh);
    setPrivateJwk(fresh);
    setMyPublicJwk(identity.publicJwk);
    setPassword("");
    setNeedsKey("ready");
    setKeyRound((n) => n + 1);
  };

  const unlock = async () => {
    setKeyProblem(null);
    const res = await fetch("/api/portal/keys");
    const data = (await res.json()) as { pepper: string; mine: { wrappedPrivate: string; salt: string } | null };
    if (!data.mine) return;
    const jwk = await unlockIdentity(lockPhrase(password, data.pepper), data.mine.wrappedPrivate, data.mine.salt);
    if (!jwk) {
      setKeyProblem("That code does not open your key.");
      return;
    }
    vault.put(jwk);
    setPrivateJwk(jwk);
    setPassword("");
    setNeedsKey("ready");
  };

  /* ---- reading ---------------------------------------------------------- */

  useEffect(() => {
    if (!privateJwk) return;
    let cancelled = false;

    (async () => {
      const next: Record<string, { text: string | null; images: Record<string, string> }> = {};
      for (const m of messages.slice(0, 120)) {
        if (opened[m.id]) continue;
        const envelope: Envelope = { senderPublicJwk: m.senderPublicJwk, body: m.body, keys: m.keys };
        const key = await openContentKey(privateJwk, envelope, me.id);
        if (!key) {
          next[m.id] = { text: null, images: {} };
          continue;
        }
        const text = m.body ? await openText(key, m.body) : "";
        const images: Record<string, string> = {};
        for (const a of m.attachments.filter((x) => x.isImage)) {
          try {
            const raw = await (await fetch(`/api/portal/files/${a.id}`)).arrayBuffer();
            const plain = await openBytes(key, a.iv, raw);
            if (plain) images[a.id] = URL.createObjectURL(new Blob([plain], { type: a.type }));
          } catch {
            // leave it out; the file chip still offers a download
          }
        }
        next[m.id] = { text, images };
      }
      if (!cancelled && Object.keys(next).length) setOpened((prev) => ({ ...prev, ...next }));
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, privateJwk, me.id]);

  /** Files are fetched locked and opened here, never on the server. */
  const saveFile = async (m: Message, attachmentId: string) => {
    if (!privateJwk) return;
    const attachment = m.attachments.find((a) => a.id === attachmentId);
    if (!attachment) return;
    const key = await openContentKey(privateJwk, { senderPublicJwk: m.senderPublicJwk, body: m.body, keys: m.keys }, me.id);
    if (!key) return;
    const raw = await (await fetch(`/api/portal/files/${attachmentId}`)).arrayBuffer();
    const plain = await openBytes(key, attachment.iv, raw);
    if (!plain) return;
    const url = URL.createObjectURL(new Blob([plain], { type: attachment.type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- the thread ------------------------------------------------------- */

  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), 12_000);
    const onFocus = () => router.refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  useEffect(() => {
    if (!messages.some((m) => !m.readBy.includes(me.id))) return;
    void fetch("/api/portal/messages/read", { method: "POST" }).then(() => router.refresh());
  }, [messages, me.id, router]);

  const thread = useMemo(
    () =>
      withDays(
        messages
          .filter((m) =>
            room === "ALL" ? m.toId === null : (m.fromId === me.id && m.toId === room) || (m.fromId === room && m.toId === me.id),
          )
          .slice()
          .reverse(),
      ),
    [messages, room, me.id],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread.length, room]);

  const unreadFor = (id: string) =>
    messages.filter((m) => !m.readBy.includes(me.id) && (id === "ALL" ? m.toId === null : m.fromId === id && m.toId === me.id))
      .length;

  const addFiles = (list: FileList | File[] | null) => {
    if (!list) return;
    const picked = Array.from(list);
    const tooBig = picked.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig) {
      setProblem(`${tooBig.name} is over ${MAX_MB}MB.`);
      return;
    }
    setProblem(null);
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_FILES));
  };

  const send = async () => {
    if (busy || !privateJwk || !myPublicJwk) return;
    if (!body.trim() && files.length === 0) return;
    setBusy(true);
    setProblem(null);

    // Everyone who should be able to read this, including me.
    const readerIds = room === "ALL" ? people.map((p) => p.id) : [me.id, room];
    const readers = Array.from(new Set(readerIds))
      .map((id) => ({ id, publicJwk: publicKeys[id] }))
      .filter((r) => Boolean(r.publicJwk));

    if (!readers.some((r) => r.id === me.id)) {
      setProblem("Your key is not ready yet. Reload the page.");
      setBusy(false);
      return;
    }
    if (room !== "ALL" && !readers.some((r) => r.id === room)) {
      setProblem("They have not signed in to the room yet, so nothing can be locked for them.");
      setBusy(false);
      return;
    }

    try {
      const { envelope, sealedFiles } = await sealMessage({
        privateJwk,
        senderPublicJwk: myPublicJwk,
        readers,
        body: body.trim(),
        files,
      });

      const form = new FormData();
      form.set("to", room);
      form.set("envelope", JSON.stringify(envelope));
      form.set("fileIvs", JSON.stringify(sealedFiles.map((f) => f.iv)));
      form.set("fileNames", JSON.stringify(sealedFiles.map((f) => ({ name: f.name, type: f.type, size: f.size }))));
      sealedFiles.forEach((f, i) => form.append("files", f.blob, `sealed-${i}`));

      const res = await fetch("/api/portal/messages", { method: "POST", body: form });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setProblem(
          data?.error === "file-type"
            ? "That kind of file is not allowed here."
            : data?.error === "slow-down"
              ? "Slow down a moment."
              : "Could not send that. Try again.",
        );
        return;
      }
      setBody("");
      setFiles([]);
      router.refresh();
    } catch {
      setProblem("Could not lock that message. Reload and try again.");
    } finally {
      setBusy(false);
    }
  };

  const roomName = room === "ALL" ? "Everyone" : (people.find((p) => p.id === room)?.name ?? "Someone");

  /* ---- the key gate ----------------------------------------------------- */

  if (needsKey !== "ready") {
    return (
      <div className="wr" style={{ display: "grid", placeItems: "center" }}>
        <div className="wr-panel">
          <span className="wr-mark" style={{ marginBottom: 12 }}>
            {ROOM.initial}
          </span>
          {needsKey === "loading" && <p className="wr-hint">Checking your key...</p>}

          {needsKey === "new" && (
            <>
              <h2>Set up your key</h2>
              <p className="wr-hint" style={{ marginBottom: 14 }}>
                Messages here are locked on your device before they are sent, and only the people they are for can open them.
                Your key is protected by your own six-digit code. We cannot read it, and we cannot reset it: if you forget the
                code, the messages written to that key are gone for good.
              </p>
              <label className="wr-hint" htmlFor="wr-pass">
                Your six-digit code
              </label>
              <input
                id="wr-pass"
                type="password"
                className="wr-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setUpKey()}
                autoComplete="current-password"
              />
              {keyProblem && (
                <p className="wr-alert" style={{ marginTop: 8 }}>
                  {keyProblem}
                </p>
              )}
              <button type="button" className="wr-btn wr-send" style={{ marginTop: 14, width: "100%" }} onClick={setUpKey}>
                Create my key
              </button>
            </>
          )}

          {needsKey === "unlock" && (
            <>
              <h2>Unlock the room</h2>
              <p className="wr-hint" style={{ marginBottom: 14 }}>
                Your key stays on this device for this tab only. Type your six-digit code to open it.
              </p>
              <input
                type="password"
                className="wr-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && unlock()}
                autoComplete="current-password"
                placeholder="Six-digit code"
              />
              {keyProblem && (
                <p className="wr-alert" style={{ marginTop: 8 }}>
                  {keyProblem}
                </p>
              )}
              <button type="button" className="wr-btn wr-send" style={{ marginTop: 14, width: "100%" }} onClick={unlock}>
                Unlock
              </button>
            </>
          )}

          <Link href="/portal" className="wr-link" style={{ display: "inline-block", marginTop: 14 }}>
            ← Back to the workspace
          </Link>
        </div>
      </div>
    );
  }

  /* ---- the room --------------------------------------------------------- */

  return (
    <div className="wr">
      <header className="wr-head">
        <span className="wr-mark">{ROOM.initial}</span>
        <span>
          <span className="wr-name">{ROOM.name}</span>
          <span className="wr-tagline" style={{ marginLeft: 10 }}>
            {ROOM.tagline}
          </span>
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <span className="wr-lock">🔒 end to end encrypted</span>
          <button type="button" className="wr-link" onClick={() => setProfileOpen((v) => !v)}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Avatar person={me} size={20} />
              {me.name}
            </span>
          </button>
          <Link href="/portal" className="wr-link">
            ← Workspace
          </Link>
        </span>
      </header>

      {profileOpen && (
        <ProfileEditor
          me={me}
          onDone={() => {
            setProfileOpen(false);
            router.refresh();
          }}
        />
      )}

      <div className="wr-main">
        <aside className="wr-side">
          <p className="wr-side-title">Rooms</p>
          <button type="button" className="wr-room" aria-current={room === "ALL"} onClick={() => setRoom("ALL")}>
            <span className="wr-avatar">All</span>
            Everyone
            {unreadFor("ALL") > 0 && <span className="wr-badge">{unreadFor("ALL")}</span>}
          </button>

          <p className="wr-side-title" style={{ marginTop: 12 }}>
            Direct
          </p>
          {people
            .filter((p) => p.id !== me.id)
            .map((p) => (
              <button key={p.id} type="button" className="wr-room" aria-current={room === p.id} onClick={() => setRoom(p.id)}>
                <Avatar person={p} />
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                {unreadFor(p.id) > 0 && <span className="wr-badge">{unreadFor(p.id)}</span>}
              </button>
            ))}
        </aside>

        <section className="wr-thread">
          <header className="wr-thread-head">
            <div style={{ fontWeight: 600 }}>{roomName}</div>
            <div className="wr-hint">
              {room === "ALL"
                ? `Everyone in the workspace · ${people.length} people · locked for each of them`
                : `Only you and ${roomName} hold the keys to this`}
            </div>
          </header>

          <div className="wr-scroll">
            {thread.length === 0 && (
              <p className="wr-empty">
                Nothing here yet.
                <br />
                Say something, or paste a screenshot straight in.
              </p>
            )}

            {thread.map(({ message: m, day, first, startsRun, endsRun }) => {
              const mine = m.fromId === me.id;
              const plain = opened[m.id];
              const sender = people.find((p) => p.id === m.fromId);
              const seen = m.readBy.filter((id) => id !== me.id).length > 0;
              return (
                <div key={m.id} style={{ display: "contents" }}>
                  {first && <p className="wr-day">{day}</p>}
                  <div className={`wr-row${mine ? " wr-row-mine" : ""}${endsRun ? " wr-row-last" : ""}`}>
                    {!mine && (
                      <span className="wr-row-avatar">{endsRun && sender ? <Avatar person={sender} size={26} /> : null}</span>
                    )}
                    <article
                      className={`wr-bubble${mine ? " wr-bubble-mine" : ""}${endsRun ? " wr-bubble-tail" : ""}`}
                    >
                      {!mine && startsRun && room === "ALL" && <div className="wr-who">{m.fromName}</div>}

                    {plain === undefined && <div className="wr-unreadable">Opening...</div>}
                    {plain && plain.text === null && (
                      <div className="wr-unreadable">This one was not locked for you, so it cannot be opened here.</div>
                    )}
                    {plain?.text ? <div className="wr-text">{plain.text}</div> : null}

                    {m.attachments.length > 0 && (
                      <div className="wr-files">
                        {m.attachments.map((a) =>
                          a.isImage && plain?.images[a.id] ? (
                            <a key={a.id} href={plain.images[a.id]} target="_blank" rel="noreferrer">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={plain.images[a.id]} alt={a.name} className="wr-image" />
                            </a>
                          ) : (
                            <button key={a.id} type="button" className="wr-file" onClick={() => saveFile(m, a.id)}>
                              {a.name}
                            </button>
                          ),
                        )}
                      </div>
                    )}

                      <div className="wr-foot">
                        <span>{time(m.createdAt)}</span>
                        {mine && (
                          <span className={`wr-ticks${seen ? " wr-ticks-seen" : ""}`} title={seen ? "Read" : "Sent"}>
                            {seen ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </article>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          <div className="wr-compose">
            <div className="wr-box">
              <textarea
                className="wr-input"
                rows={2}
                value={body}
                placeholder={room === "ALL" ? "Say something to everyone..." : `Message ${roomName}...`}
                onChange={(e) => setBody(e.target.value)}
                onPaste={(e) => {
                  const pasted = Array.from(e.clipboardData.files);
                  if (pasted.length) {
                    e.preventDefault();
                    addFiles(pasted);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />

              {files.length > 0 && (
                <div className="wr-files">
                  {files.map((f, i) => (
                    <span key={`${f.name}-${i}`} className="wr-chip">
                      {f.name}
                      <button
                        type="button"
                        onClick={() => setFiles(files.filter((_, n) => n !== i))}
                        aria-label={`Remove ${f.name}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="wr-actions">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  hidden
                  accept="image/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => addFiles(e.target.files)}
                />
                <button type="button" className="wr-btn" onClick={() => fileRef.current?.click()}>
                  Attach
                </button>
                <span className="wr-hint">Paste a screenshot, or Ctrl+Enter to send</span>
                {problem && <span className="wr-alert">{problem}</span>}
                <button
                  type="button"
                  className="wr-btn wr-send"
                  style={{ marginLeft: "auto" }}
                  disabled={busy || (!body.trim() && files.length === 0)}
                  onClick={send}
                >
                  {busy ? "Locking..." : room === "ALL" ? "Send to everyone" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Your own picture and line, the way a messenger lets you set them. */
function ProfileEditor({
  me,
  onDone,
}: {
  me: { name: string; avatarId: string | null; about: string | null };
  onDone: () => void;
}) {
  const [about, setAbout] = useState(me.about ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const save = async (remove = false) => {
    setBusy(true);
    const form = new FormData();
    form.set("about", about);
    if (remove) form.set("removeAvatar", "1");
    else if (file) form.set("avatar", file);
    await fetch("/api/portal/profile", { method: "POST", body: form });
    setBusy(false);
    onDone();
  };

  return (
    <div className="wr-sheetline">
      <span className="wr-avatar-lg">
        {preview || me.avatarId ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={preview ?? `/api/portal/avatar/${me.avatarId}`} alt="" className="wr-photo" />
        ) : (
          initials(me.name)
        )}
      </span>
      <label className="wr-btn" style={{ cursor: "pointer" }}>
        Choose picture
        <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <input
        className="wr-field"
        style={{ maxWidth: 320, marginTop: 0 }}
        value={about}
        maxLength={140}
        placeholder="One line about you"
        onChange={(e) => setAbout(e.target.value)}
      />
      <button type="button" className="wr-btn wr-send" disabled={busy} onClick={() => save(false)}>
        Save
      </button>
      {me.avatarId && (
        <button type="button" className="wr-btn" disabled={busy} onClick={() => save(true)}>
          Remove picture
        </button>
      )}
      <button type="button" className="wr-btn" onClick={onDone}>
        Close
      </button>
    </div>
  );
}
