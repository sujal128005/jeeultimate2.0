import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparePage } from "@/components/colleges/ComparePage";

export const metadata: Metadata = {
  title: "Compare Colleges",
  description: "Compare up to four IITs, NITs, IIITs, GFTIs and state colleges side by side.",
  alternates: { canonical: "/colleges/compare" },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ComparePage />
    </Suspense>
  );
}
