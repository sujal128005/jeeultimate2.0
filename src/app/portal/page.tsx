import { redirect } from "next/navigation";
import { getSession } from "@/lib/workspace/auth";
import { HOME_FOR } from "@/lib/workspace/types";

export const dynamic = "force-dynamic";

/** The front door. Sends each person to the screen their role starts on. */
export default async function PortalPage() {
  const session = await getSession();
  redirect(session ? HOME_FOR[session.role] : "/portal/signin");
}
