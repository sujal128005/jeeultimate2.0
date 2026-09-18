import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { termsSections } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using JEE Ultimate 2.0: independent guidance, official portals are the authority, and no one can promise you a seat.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalDoc eyebrow="Legal" title="Terms of Use" sections={termsSections} />;
}
