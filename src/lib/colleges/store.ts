"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Shortlist and compare selections, saved in this browser.
 * Kept behind this small API so a Student Dashboard can sync them later
 * (swap read/write for an API call).
 */

export const COMPARE_MAX = 4;
const KEYS = { saved: "ju:colleges:shortlist", compare: "ju:colleges:compare" } as const;
type ListKey = keyof typeof KEYS;
const EVENT = "ju:colleges:store";
const EMPTY: string[] = [];
const cache: Record<string, { raw: string | null; value: string[] }> = {};

function read(key: ListKey): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEYS[key]);
  } catch {
    raw = null;
  }
  const hit = cache[key];
  if (hit && hit.raw === raw) return hit.value;
  let value: string[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    value = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache[key] = { raw, value };
  return value;
}

function write(key: ListKey, value: string[]) {
  try {
    window.localStorage.setItem(KEYS[key], JSON.stringify(value));
  } catch {
    // storage unavailable (private mode): keep working for this page view
    cache[key] = { raw: JSON.stringify(value), value };
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (!e.key || Object.values(KEYS).includes(e.key as (typeof KEYS)[ListKey])) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

function useList(key: ListKey) {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY,
  );
}

export function useShortlist() {
  const saved = useList("saved");
  const toggle = useCallback((slug: string) => {
    const list = read("saved");
    write("saved", list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]);
  }, []);
  const remove = useCallback((slug: string) => write("saved", read("saved").filter((s) => s !== slug)), []);
  const clear = useCallback(() => write("saved", []), []);
  return { saved, has: (slug: string) => saved.includes(slug), toggle, remove, clear };
}

export function useCompare() {
  const list = useList("compare");
  /** Returns false when the list is already full. */
  const toggle = useCallback((slug: string) => {
    const current = read("compare");
    if (current.includes(slug)) {
      write("compare", current.filter((s) => s !== slug));
      return true;
    }
    if (current.length >= COMPARE_MAX) return false;
    write("compare", [...current, slug]);
    return true;
  }, []);
  const set = useCallback((slugs: string[]) => write("compare", [...new Set(slugs)].slice(0, COMPARE_MAX)), []);
  const remove = useCallback((slug: string) => write("compare", read("compare").filter((s) => s !== slug)), []);
  const clear = useCallback(() => write("compare", []), []);
  return { list, has: (slug: string) => list.includes(slug), full: list.length >= COMPARE_MAX, toggle, set, remove, clear };
}
