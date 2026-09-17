import type { Metadata } from "next";
import { SimplePage } from "@/components/placeholder/SimplePage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the JEE Ultimate 2.0 team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SimplePage
      eyebrow="Contact"
      title="Let’s talk about your admission."
      description="Our contact channels are being set up here. Until then, reach us through our social pages."
    />
  );
}
