import type { Metadata } from "next";
import { Suspense } from "react";
import { CollegeExplorerApp } from "@/components/colleges/CollegeExplorerApp";

export const metadata: Metadata = {
  title: "Colleges",
  description:
    "Find the right college. Search and filter IITs, NITs, IIITs, GFTIs and JAC Delhi and UPTAC colleges by state, city, branch, course and quota.",
  alternates: { canonical: "/colleges" },
};

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CollegeExplorerApp />
    </Suspense>
  );
}
