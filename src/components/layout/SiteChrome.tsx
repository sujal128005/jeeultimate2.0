"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { BackToTop } from "./BackToTop";

/** Routes that bring their own chrome (header, footer, navigation). */
const immersiveSegments = new Set(["career"]);

/**
 * Saarthi stays out of the Career world, and out of the sign-in areas for
 * team, mentors and admins, where a general assistant has no business.
 */
const noAssistantSegments = new Set(["career", "portal"]);

/**
 * Wraps pages in the main site's header and footer, except for
 * immersive experiences like /career which define their own.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const immersive = segment !== null && immersiveSegments.has(segment);
  const assistant = segment === null || !noAssistantSegments.has(segment);

  return (
    <>
      {!immersive && header}
      <main id="main" className="relative z-(--z-raised)">
        {children}
      </main>
      {!immersive && footer}
      {assistant && <AssistantLauncher />}
      <BackToTop />
    </>
  );
}
