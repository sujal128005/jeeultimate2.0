"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_STREAM, STREAMS } from "@/config/counselling";

/**
 * Which counselling this screen is about. Everything below the strip belongs
 * to the one that is lit; nothing is mixed. "All" is last because it is for
 * totalling a season, not for a day's work.
 */
export function CounsellingTabs({ counts }: { counts?: Record<string, number> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("counselling") ?? DEFAULT_STREAM;

  const go = (value: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("counselling", value);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const tabs: { key: string; label: string; note?: string }[] = [
    ...STREAMS.map((s) => ({ key: s.key, label: s.label, note: s.note })),
    { key: "ALL", label: "All" },
  ];

  return (
    <div className="ws-streams" role="tablist" aria-label="Counselling">
      {tabs.map((tab) => {
        const here = current === tab.key;
        const count = counts?.[tab.key];
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={here}
            title={tab.note}
            onClick={() => go(tab.key)}
            className="ws-stream"
          >
            {tab.label}
            {count !== undefined && <span className="ws-stream-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
