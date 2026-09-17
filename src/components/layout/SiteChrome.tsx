"use client";

import { useSelectedLayoutSegment } from "next/navigation";

/** Routes that bring their own chrome (header, footer, navigation). */
const immersiveSegments = new Set(["career"]);

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

  return (
    <>
      {!immersive && header}
      <main id="main" className="relative z-(--z-raised)">
        {children}
      </main>
      {!immersive && footer}
    </>
  );
}
