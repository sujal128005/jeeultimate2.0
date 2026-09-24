"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROOM } from "@/config/room";
import { CounsellingTabs } from "./CounsellingTabs";
import { ROLE_LABEL, type Role } from "@/lib/workspace/types";

const NAV: { href: string; label: string; roles: Role[] }[] = [
  { href: "/portal/overview", label: "Overview", roles: ["OWNER", "MANAGER", "ANALYST"] },
  { href: "/portal/assign", label: "Assign", roles: ["OWNER", "MANAGER"] },
  { href: "/portal/mentors", label: "Mentors", roles: ["OWNER", "MANAGER", "ANALYST"] },
  { href: "/portal/students", label: "Students", roles: ["OWNER", "MANAGER", "ANALYST"] },
  { href: "/portal/my", label: "My students", roles: ["MENTOR"] },
  { href: "/portal/messages", label: ROOM.name, roles: ["OWNER", "MANAGER", "ANALYST", "MENTOR"] },
  { href: "/portal/activity", label: "Activity", roles: ["OWNER", "MANAGER", "ANALYST"] },
];

/**
 * The window: a title bar, a menu strip, the screen, and a status line. The
 * same three things in the same three places on every screen.
 */
export function Shell({
  session,
  unassigned,
  unread,
  status,
  streamCounts,
  noData,
  children,
}: {
  session: { name: string; role: Role };
  unassigned: number | null;
  unread?: number;
  status?: string;
  /** How many live students sit in each counselling, for the strip. */
  streamCounts?: Record<string, number>;
  /** True when no student has enrolled yet at all, in any counselling. */
  noData?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const items = NAV.filter((n) => n.roles.includes(session.role));

  const signOut = async () => {
    await fetch("/api/portal/signout", { method: "POST" });
    router.push("/portal/signin");
    router.refresh();
  };

  return (
    <div className="ws" style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <div className="ws-titlebar">
        <span className="ws-title">JEE ULTIMATE 2.0 — WORKSPACE</span>
        <span style={{ marginLeft: "auto" }} className="ws-note">
          {session.name} ({ROLE_LABEL[session.role]})
        </span>
        <Link href="/" className="ws-btn" style={{ height: 20, fontSize: 11 }}>
          Website
        </Link>
        <button type="button" onClick={signOut} className="ws-btn" style={{ height: 20, fontSize: 11 }}>
          Sign out
        </button>
      </div>

      <nav className="ws-menubar">
        {items.map((item) => {
          const here = pathname === item.href;
          const badge =
            item.href === "/portal/assign" && unassigned
              ? unassigned
              : item.href === "/portal/messages" && unread
                ? unread
                : null;
          return (
            <Link key={item.href} href={item.href} aria-current={here ? "page" : undefined} className="ws-menu">
              {item.label}
              {badge ? <span className="ws-menu-count">{badge}</span> : null}
            </Link>
          );
        })}
      </nav>

      {/* The message room is the whole team at once, so it has no counselling. */}
      {pathname !== "/portal/messages" && <CounsellingTabs counts={streamCounts} />}

      {/* Every figure below is zero because nothing has come in yet, not
          because something is broken. Worth saying out loud. */}
      {noData && pathname !== "/portal/messages" && (
        <p className="ws-nodata">
          Counselling has not started. Nothing here until the first enrolment comes through, and then it appears on
          its own counselling tab.
        </p>
      )}

      <div className="ws-body" style={{ flex: 1 }}>
        {children}
      </div>

      <div className="ws-statusbar">
        <span>Ready.</span>
        {status && <span>{status}</span>}
        <span style={{ marginLeft: "auto" }}>
          Signed in as {session.name} · {ROLE_LABEL[session.role]}
        </span>
      </div>
    </div>
  );
}
