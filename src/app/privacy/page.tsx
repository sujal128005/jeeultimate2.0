import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { privacySections } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What JEE Ultimate 2.0 does and does not collect. No accounts, no visitor database, and everything you save here stays in your own browser.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalDoc eyebrow="Legal" title="Privacy Policy" sections={privacySections} />;
}
