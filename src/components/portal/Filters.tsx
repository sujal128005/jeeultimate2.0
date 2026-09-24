"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CATEGORY_LABEL, GENDERS, GENDER_LABEL, STATUSES, STATUS_LABEL } from "@/lib/workspace/types";

/**
 * Filters live in the address bar, so a view can be bookmarked, sent to the
 * other admin, and survives a reload. Which counselling you are looking at is
 * not here: that is the strip above, and it stays put when these are cleared.
 */
export function Filters({ mentors, showSearch = false }: { mentors: { id: string; name: string }[]; showSearch?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "ALL") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  // Counselling is not listed: it belongs to the strip above and clearing the
  // filters must not quietly move someone to a different one.
  const any = ["days", "category", "gender", "mentorId", "status", "q"].some((k) => params.get(k));

  const clear = () => {
    const kept = new URLSearchParams();
    const counselling = params.get("counselling");
    if (counselling) kept.set("counselling", counselling);
    router.replace(kept.size ? `${pathname}?${kept.toString()}` : pathname, { scroll: false });
  };

  return (
    <div className="ws-toolbar">
      <span className="ws-toolbar-label">Filter</span>

      <select className="ws-select" value={params.get("days") ?? "ALL"} onChange={(e) => set("days", e.target.value)}>
        <option value="ALL">All time</option>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>

      <select className="ws-select" value={params.get("category") ?? "ALL"} onChange={(e) => set("category", e.target.value)}>
        <option value="ALL">Any category</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {CATEGORY_LABEL[c]}
          </option>
        ))}
      </select>

      <select className="ws-select" value={params.get("gender") ?? "ALL"} onChange={(e) => set("gender", e.target.value)}>
        <option value="ALL">Any gender</option>
        {GENDERS.map((g) => (
          <option key={g} value={g}>
            {GENDER_LABEL[g]}
          </option>
        ))}
      </select>

      <select className="ws-select" value={params.get("mentorId") ?? "ALL"} onChange={(e) => set("mentorId", e.target.value)}>
        <option value="ALL">Any mentor</option>
        <option value="NONE">Not assigned</option>
        {mentors.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <select className="ws-select" value={params.get("status") ?? "ALL"} onChange={(e) => set("status", e.target.value)}>
        <option value="ALL">Any status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>

      {showSearch && (
        <input
          type="search"
          className="ws-input"
          style={{ width: 210 }}
          placeholder="Name, email, phone, rank"
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => set("q", e.target.value)}
        />
      )}

      {any && (
        <button type="button" className="ws-btn" onClick={clear}>
          Clear
        </button>
      )}
    </div>
  );
}
