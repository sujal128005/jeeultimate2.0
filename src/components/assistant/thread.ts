"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The conversation, kept in this browser so it survives a page change.
 * Nothing is stored on a server: the only thing that leaves the device is
 * the question itself, on its way to the model.
 */
const KEY = "ju:saarthi:thread";
const EVENT = "ju:saarthi:thread-change";
const EMPTY: Message[] = [];
const MAX = 40;

export type Message = { id: string; role: "user" | "assistant"; content: string; at: number };

let cache: { raw: string | null; value: Message[] } = { raw: null, value: EMPTY };

function read(): Message[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (cache.raw === raw) return cache.value;
  let value: Message[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    value = Array.isArray(parsed)
      ? parsed.filter((m): m is Message => typeof m?.id === "string" && typeof m?.content === "string")
      : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function write(value: Message[]) {
  const trimmed = value.slice(-MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    cache = { raw: JSON.stringify(trimmed), value: trimmed };
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function useThread() {
  const messages = useSyncExternalStore(subscribe, read, () => EMPTY);

  const append = useCallback((role: Message["role"], content: string) => {
    const message: Message = { id: newId(), role, content, at: Date.now() };
    write([...read(), message]);
    return message.id;
  }, []);

  /** Streaming: rewrite the tail of the last assistant message in place. */
  const patch = useCallback((id: string, content: string) => {
    write(read().map((m) => (m.id === id ? { ...m, content } : m)));
  }, []);

  const drop = useCallback((id: string) => write(read().filter((m) => m.id !== id)), []);
  const clear = useCallback(() => write([]), []);

  return { messages, append, patch, drop, clear };
}
