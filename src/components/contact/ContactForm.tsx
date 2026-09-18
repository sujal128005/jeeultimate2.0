"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS_EMAIL } from "@/data/contact";
import { cn } from "@/lib/cn";

const MAX_FILES = 3;
const MAX_FILE_MB = 4;

type Status = "idle" | "sending" | "sent" | "handoff" | "error";

/**
 * One form, three shapes. Send posts to our delivery route; if the site has no
 * mail key configured yet, it opens the visitor's own mail app with everything
 * already written, and says so. It never claims a message was delivered when
 * it was not.
 */
export function ContactForm({
  lane,
  topics,
  withFiles = false,
  messageLabel,
  placeholder,
  children,
}: {
  lane: "business" | "counselling" | "correction";
  topics?: string[];
  withFiles?: boolean;
  messageLabel: string;
  placeholder: string;
  /** Extra action shown beside the send button */
  children?: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState(topics?.[0] ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).slice(0, MAX_FILES);
    const tooBig = picked.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setProblem(`${tooBig.name} is over ${MAX_FILE_MB}MB. Link it instead, or send a smaller version.`);
      return;
    }
    setProblem(null);
    setFiles(picked);
  };

  /** No mail key on the site yet: hand the message to their own mail app. */
  const handOff = () => {
    const subject = `${lane === "business" ? "Business" : lane === "correction" ? "Correction" : "Counselling question"}${topic ? `: ${topic}` : ""}`;
    const body = [message, "", `Reply to: ${email}`, files.length ? `(${files.length} file(s) to attach here)` : ""]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("handoff");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setProblem(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setProblem("That email address does not look complete.");
      return;
    }
    if (message.trim().length < 10) {
      setProblem("Add a little more so we can actually help.");
      return;
    }

    setStatus("sending");
    const body = new FormData();
    body.set("lane", lane);
    body.set("email", email.trim());
    body.set("message", message.trim());
    if (topic) body.set("topic", topic);
    files.forEach((f) => body.append("files", f));

    try {
      const res = await fetch("/api/contact", { method: "POST", body });
      if (res.status === 503) {
        handOff();
        return;
      }
      if (res.status === 429) {
        setProblem("That is a lot of messages at once. Give it a minute.");
        setStatus("error");
        return;
      }
      if (res.status === 400) {
        const data = await res.json().catch(() => null);
        setProblem(
          data?.error === "file-too-large"
            ? `One of those files is over ${MAX_FILE_MB}MB.`
            : "Something in the form did not look right. Check the email and the message.",
        );
        setStatus("error");
        return;
      }
      // Our mail service is down or refused: do not lose what they wrote.
      if (!res.ok) {
        handOff();
        return;
      }
      setStatus("sent");
    } catch {
      handOff();
    }
  };

  if (status === "sent") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent-soft p-5">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
          <Icon name="check" className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p className="type-body-sm font-semibold text-fg">Message received. We will get in touch soon.</p>
          <p className="mt-1 type-caption text-fg-muted">The reply comes to {email}, so keep an eye on that inbox.</p>
        </div>
      </div>
    );
  }

  if (status === "handoff") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-surface-2 p-5">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-fg/10 text-fg-2">
          <Icon name="mail" className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p className="type-body-sm font-semibold text-fg">Your mail app is opening with this ready to send.</p>
          <p className="mt-1 type-caption text-fg-muted">
            Press send there and it reaches us. Attach your files in that window, since they cannot travel from this page yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
      {topics && (
        <label className="flex flex-col gap-1.5">
          <span className="type-caption font-medium text-fg-2">What is it about</span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-11 rounded-2xl bg-surface-2 px-3.5 type-body-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/45"
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="type-caption font-medium text-fg-2">{messageLabel}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="resize-none rounded-2xl bg-surface-2 p-3.5 type-body-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-accent/45"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="type-caption font-medium text-fg-2">Your email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="h-11 rounded-2xl bg-surface-2 px-3.5 type-body-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-accent/45"
        />
      </label>

      {withFiles && (
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => pickFiles(e.target.files)}
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-surface-2 px-4 type-caption font-semibold text-fg-2 transition-colors hover:text-fg"
          >
            <Icon name="file" className="size-3.5" />
            {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} attached` : "Attach a file"}
          </button>
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {files.map((f) => (
                <li key={f.name} className="max-w-full truncate rounded-full bg-surface-2 px-2.5 py-1 type-meta text-fg-muted">
                  {f.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {problem && (
        <p className="flex items-start gap-2 type-caption text-fg-2">
          <Icon name="alert" className="mt-px size-3.5 shrink-0 text-accent-text" />
          {problem}
        </p>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-2.5">
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full bg-contrast px-5 type-caption font-semibold text-on-contrast transition-transform duration-(--duration-base) ease-(--ease-spring)",
            status === "sending" ? "opacity-60" : "hover:-translate-y-0.5",
          )}
        >
          {status === "sending" ? "Sending" : "Send"}
          <Icon name="send" className="size-3.5" />
        </button>
        {children}
      </div>
    </form>
  );
}
