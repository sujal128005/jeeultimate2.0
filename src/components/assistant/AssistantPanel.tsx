"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import { assistant } from "@/data/assistant";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import { AssistantMark } from "./AssistantMark";
import { Markdown } from "./Markdown";
import { useThread, type Message } from "./thread";

/** Corner ticks, the way a design tool shows what is selected. */
function Handles() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-accent/45">
      {["-top-[3px] -left-[3px]", "-top-[3px] -right-[3px]", "-bottom-[3px] -right-[3px]", "-bottom-[3px] -left-[3px]"].map(
        (pos) => (
          <span key={pos} className={cn("absolute size-[7px] rounded-[2px] bg-surface ring-[1.5px] ring-accent", pos)} />
        ),
      )}
    </span>
  );
}

/** A card with a name tab above it, like a frame on a canvas. */
function Frame({
  label,
  selected,
  className,
  children,
}: {
  label: string;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span
        className={cn("mb-1.5 block font-mono text-[10px] tracking-[0.1em]", selected ? "text-accent-text" : "text-fg-subtle")}
      >
        {label}
      </span>
      <div className={cn("relative rounded-[18px] bg-surface p-4 shadow-hairline", className)}>
        {children}
        {selected && <Handles />}
      </div>
    </div>
  );
}

const clock = (at: number) => new Date(at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { messages, append, patch, clear } = useThread();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /** Keep the newest line in view: on open, on send, and while text streams. */
  const scrollToEnd = useCallback((behavior: ScrollBehavior = "smooth") => {
    const box = scrollRef.current;
    if (!box) return;
    box.scrollTo({ top: box.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
      scrollToEnd("auto");
    }, 220);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open, onClose, scrollToEnd]);

  useEffect(() => {
    if (open) scrollToEnd();
  }, [messages, busy, open, scrollToEnd]);

  const ask = async (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setError(null);
    setDraft("");
    append("user", value);
    const replyId = append("assistant", "");
    setBusy(true);
    scrollToEnd();

    const history = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: value },
    ].filter((m) => m.content.trim().length > 0);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/saarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history, pathname }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => null);
        const detail = typeof body?.detail === "string" ? body.detail : null;
        const reason =
          res.status === 503
            ? "Saarthi is not switched on yet on this site. Your question is saved here, and our team can answer it in the meantime."
            : res.status === 429
              ? "That was a lot of questions very quickly. Give it a minute and ask again."
              : body?.error === "busy"
                ? "The model is busy at its end right now. That usually passes in a few seconds, so please ask me again."
                : detail
                  ? `Something went wrong reaching Saarthi.\n\n${detail}`
                  : "Something went wrong reaching Saarthi. Please try again.";
        patch(replyId, reason);
        setError(res.status === 503 ? "not-configured" : "error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        answer += decoder.decode(chunk, { stream: true });
        patch(replyId, answer);
      }
      if (!answer.trim()) patch(replyId, "That came back empty. Ask me again?");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") {
        patch(replyId, "The connection dropped before I could finish. Try once more.");
        setError("error");
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  };

  const empty = messages.length === 0;
  // The launcher sits bottom right on a desktop and bottom left on a phone.
  // Measuring the real distance to the furthest corner keeps the whole sweep
  // on screen, instead of finishing early behind an oversized circle.
  const spread = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", cb);
      window.addEventListener("resize", cb);
      return () => {
        mq.removeEventListener("change", cb);
        window.removeEventListener("resize", cb);
      };
    },
    () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      const x = wide ? w - 56 : 40;
      const y = wide ? h - 56 : h - 112;
      return `${Math.round(x)}px ${Math.round(y)}px|${Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y)))}`;
    },
    () => "50% 50%|1400",
  );
  const [from, reachText] = spread.split("|");
  const reach = Number(reachText);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* The dim spreads out from under the button you pressed, the way a
              folded screen opens: a circle that grows across the page rather
              than a rectangle that fades. */}
          <motion.button
            type="button"
            aria-label={`Close ${assistant.name}`}
            initial={{ clipPath: `circle(0px at ${from})`, opacity: 0.9 }}
            animate={{
              clipPath: `circle(${reach}px at ${from})`,
              opacity: 1,
              transition: { clipPath: { duration: 0.66, ease: ease.spread }, opacity: { duration: 0.2 } },
            }}
            exit={{
              clipPath: `circle(0px at ${from})`,
              opacity: 0.9,
              transition: { duration: 0.36, ease: ease.spread },
            }}
            onClick={onClose}
            className="fixed inset-0 z-(--z-overlay) bg-fg/28 backdrop-blur-[7px] md:bg-fg/14"
          />

          <motion.aside
            role="dialog"
            aria-label={assistant.name}
            initial={{ opacity: 0, scaleX: 0.24, scaleY: 0.9, rotateY: -34 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1, rotateY: 0, transition: spring.panel }}
            exit={{ opacity: 0, scaleX: 0.28, scaleY: 0.92, rotateY: -26, transition: { duration: 0.24, ease: ease.out } }}
            style={{ originX: 1, originY: 1, transformPerspective: 1500 }}
            className={cn(
              "glass-prominent fixed z-(--z-modal) flex flex-col overflow-hidden rounded-[26px]",
              "inset-x-3 bottom-3 top-[max(3.5rem,8vh)]",
              "md:inset-auto md:right-6 md:bottom-6 md:top-[max(5rem,9vh)] md:w-[min(92vw,30rem)]",
            )}
          >
            <header className="flex items-center gap-3 border-b border-line/70 px-4 py-3">
              <AssistantMark className="size-7 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 type-body-sm font-semibold">
                  {assistant.name}
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 type-meta text-accent-text">JEE Ultimate 2.0</span>
                </p>
                <p className="truncate type-meta text-fg-muted">{assistant.role}</p>
              </div>
              {!empty && (
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-lg px-2 py-1 type-meta font-semibold text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
                >
                  New chat
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-xl text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
              >
                <Icon name="close" className="size-4" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1">
              <div
                ref={scrollRef}
                className="relative min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[radial-gradient(color-mix(in_oklab,var(--fg)_10%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
              >
                {/* Nothing asked yet: the invitation sits in the empty space
                    itself rather than pretending to be a first message. */}
                {empty && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center px-8">
                    <div className="text-center">
                      <p className="font-mono text-[10px] tracking-[0.1em] text-fg-subtle">{assistant.name} / start</p>
                      <p className="mt-3 max-w-[22rem] text-balance type-h4 font-normal text-fg-subtle">{assistant.tagline}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5 p-4">
                  {messages.map((m, i) => (
                    <Bubble key={m.id} message={m} streaming={busy && i === messages.length - 1} />
                  ))}

                  {error === "not-configured" && (
                    <p className="type-caption text-fg-muted">
                      Add a model key to the site to switch answers on. Until then this stays a place to leave questions.
                    </p>
                  )}

                  <div ref={endRef} />
                </div>
              </div>
            </div>

            <div className="border-t border-line/70 bg-surface/80 p-3">
              <div className="rounded-[18px] bg-surface p-2 shadow-hairline focus-within:ring-2 focus-within:ring-accent/40">
                <textarea
                  ref={inputRef}
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onFocus={() => scrollToEnd()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(draft);
                    }
                  }}
                  placeholder={`Ask ${assistant.name} anything...`}
                  className="w-full resize-none bg-transparent px-2 py-1.5 type-body-sm outline-none placeholder:text-fg-subtle"
                />
                <div className="flex items-center justify-end gap-2 px-1 pt-1">
                  {busy ? (
                    <button
                      type="button"
                      onClick={stop}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface-2 px-4 type-caption font-semibold text-fg-2"
                    >
                      <span className="size-2 rounded-[2px] bg-fg-2" />
                      Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => ask(draft)}
                      disabled={!draft.trim()}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-contrast px-4 type-caption font-semibold text-on-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-px disabled:opacity-35 disabled:hover:translate-y-0"
                    >
                      Send
                      <Icon name="send" className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Bubble({ message, streaming }: { message: Message; streaming: boolean }) {
  if (message.role === "user") {
    return (
      <Frame label={`you / ${clock(message.at)}`} selected>
        <p className="type-body-sm font-medium">{message.content}</p>
      </Frame>
    );
  }
  return (
    <Frame label={`${assistant.name} / ${clock(message.at)}`} className="bg-surface/95">
      {message.content ? <Markdown text={message.content} /> : null}
      {streaming && (
        <span className="mt-1 inline-flex items-center gap-1.5 type-meta text-fg-muted">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" />
          thinking
        </span>
      )}
    </Frame>
  );
}
