import type { Metadata } from "next";
import { SimplePage } from "@/components/placeholder/SimplePage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Member Stories",
  description: "Hear from students who went through JEE counselling with JEE Ultimate 2.0.",
  alternates: { canonical: "/testimonials" },
};

/**
 * Member stories. Add real testimonials here (with the member's permission),
 * or point `membersCta.href` in src/data/counselling-hub.ts to your video page.
 */
export default function TestimonialsPage() {
  return (
    <SimplePage
      eyebrow="Member stories"
      title="Hear it from our members."
      description="Stories from students who went through counselling with JEE Ultimate 2.0 are being collected and will appear here."
      status="Stories coming soon"
    >
      <Button href="/counselling-support" variant="glass" icon="arrow-right" className="mt-8">
        Back to counselling support
      </Button>
    </SimplePage>
  );
}
