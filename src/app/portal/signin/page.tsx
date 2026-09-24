import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/portal/SignInForm";
import { getSession } from "@/lib/workspace/auth";
import { read } from "@/lib/workspace/store";
import { HOME_FOR, ROLE_LABEL, type Role } from "@/lib/workspace/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

/** Admins first, then the analyst, then the mentors. */
const GROUP_ORDER: Role[] = ["OWNER", "MANAGER", "ANALYST", "MENTOR"];

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect(HOME_FOR[session.role]);

  const db = await read();
  const people = db.users
    .filter((u) => u.active)
    .map((u) => ({ id: u.id, name: u.name, role: u.role }))
    .sort((a, b) => GROUP_ORDER.indexOf(a.role) - GROUP_ORDER.indexOf(b.role) || a.name.localeCompare(b.name));

  const groups = GROUP_ORDER.filter((role) => people.some((p) => p.role === role)).map((role) => ({
    role,
    label: ROLE_LABEL[role],
    people: people.filter((p) => p.role === role),
  }));

  return (
    <div className="ws" style={{ display: "grid", placeItems: "center", minHeight: "100dvh", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 340 }}>
        <div className="ws-panel">
          <div className="ws-panel-head">
            <span className="ws-panel-title">Log in</span>
          </div>
          <div className="ws-panel-body">
            <p className="ws-note" style={{ marginBottom: 12 }}>
              JEE Ultimate 2.0 workspace. Staff only; students have no account here.
            </p>
            <SignInForm groups={groups} />
          </div>
        </div>
        <Link href="/" className="ws-note" style={{ display: "inline-block", marginTop: 8 }}>
          ← Back to the website
        </Link>
      </div>
    </div>
  );
}
