import type { Metadata } from "next";
import { SimplePage } from "@/components/placeholder/SimplePage";

export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <SimplePage
      eyebrow="Legal"
      title="Terms of Use"
      description="The terms that apply to using JEE Ultimate 2.0. The full terms will be published here."
      status="Terms being finalised"
    />
  );
}
