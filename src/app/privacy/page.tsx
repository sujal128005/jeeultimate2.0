import type { Metadata } from "next";
import { SimplePage } from "@/components/placeholder/SimplePage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SimplePage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How JEE Ultimate 2.0 collects, uses and protects your information. The full policy will be published here."
      status="Policy being finalised"
    />
  );
}
