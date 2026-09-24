"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Role } from "@/lib/workspace/types";

export type SignInGroup = { role: Role; label: string; people: { id: string; name: string }[] };

const PIN_LENGTH = 6;

/**
 * Two things and nothing else: say who you are, then type your six digits.
 *
 * The list is grouped by role, so picking yourself is also how you connect as
 * a mentor, an admin or the team. Each person has their own code, which is
 * what keeps "assigned by Ashu" meaningful once several people are working.
 */
export function SignInForm({ groups }: { groups: SignInGroup[] }) {
  const router = useRouter();
  const first = groups[0]?.people[0]?.id ?? "";
  const [userId, setUserId] = useState(first);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const pinRef = useRef<HTMLInputElement>(null);

  const ready = userId !== "" && pin.length === PIN_LENGTH;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !ready) return;
    setBusy(true);
    setProblem(null);
    try {
      const res = await fetch("/api/portal/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      });
      if (res.ok) {
        const data = (await res.json()) as { next: string };
        router.push(data.next);
        router.refresh();
        return;
      }
      setProblem(
        res.status === 429 ? "Too many tries. Wait fifteen minutes." : "That code is wrong.",
      );
      setPin("");
      pinRef.current?.focus();
    } catch {
      setProblem("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label className="ws-label" htmlFor="ws-who">
        Connect as
      </label>
      <select
        id="ws-who"
        className="ws-input"
        style={{ width: "100%" }}
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      >
        {groups.map((group) => (
          <optgroup key={group.role} label={group.label}>
            {group.people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <label className="ws-label" htmlFor="ws-pin" style={{ marginTop: 10 }}>
        Six-digit code
      </label>
      <input
        id="ws-pin"
        ref={pinRef}
        className="ws-input ws-pin"
        style={{ width: "100%" }}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={PIN_LENGTH}
        placeholder="******"
        aria-describedby="ws-pin-hint"
        required
        autoFocus
      />
      <p id="ws-pin-hint" className="ws-note" style={{ marginTop: 4 }}>
        {pin.length}/{PIN_LENGTH} digits
      </p>

      {problem && (
        <p className="ws-tag ws-tag-bad" style={{ display: "block", marginTop: 10, padding: "4px 6px" }} role="alert">
          {problem}
        </p>
      )}

      <button
        type="submit"
        className="ws-btn ws-btn-primary ws-btn-lg"
        style={{ width: "100%", marginTop: 12 }}
        disabled={busy || !ready}
      >
        {busy ? "Checking..." : "Log in"}
      </button>
    </form>
  );
}
