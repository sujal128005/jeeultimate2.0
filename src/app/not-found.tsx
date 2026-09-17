import { SimplePage } from "@/components/placeholder/SimplePage";

export default function NotFound() {
  return (
    <SimplePage
      eyebrow="404"
      title="This page took a different round."
      description="The page you’re looking for doesn’t exist or has moved. Let’s get you back on track."
      status="Page not found"
    />
  );
}
