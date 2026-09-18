"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Questions people ask before the answers are switched on.
 * They stay in this browser. Nothing is sent anywhere; when Saarthi goes
 * live these are the first questions it should be able to handle.
 */
const KEY = "ju:saarthi:queue";
const EVENT = "ju:saarthi:queue-change";
const EMPTY: Question[] = [];
const MAX = 12;

export type Question = { id: string; text: string; page: string; at: number };

let cache: { raw: string | null; value: Question[] } = { raw: null, value: EMPTY };

function read(): Question[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (cache.raw === raw) return cache.value;
  let value: Question[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    value = Array.isArray(parsed)
      ? parsed.filter((q): q is Question => typeof q?.id === "string" && typeof q?.text === "string")
      : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function write(value: Question[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    cache = { raw: JSON.stringify(value), value };
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

export function useQueue() {
  const queue = useSyncExternalStore(subscribe, read, () => EMPTY);
  const add = useCallback((q: { text: string; page: string }) => {
    const item: Question = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), ...q };
    write([item, ...read()].slice(0, MAX));
  }, []);
  const remove = useCallback((id: string) => write(read().filter((q) => q.id !== id)), []);
  const clear = useCallback(() => write([]), []);
  return { queue, add, remove, clear };
}
