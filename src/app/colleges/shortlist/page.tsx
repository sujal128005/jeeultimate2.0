import type { Metadata } from "next";
import { ShortlistPage } from "@/components/colleges/ShortlistPage";

export const metadata: Metadata = {
  title: "My Shortlist",
  description: "Your saved colleges on JEE Ultimate 2.0.",
  robots: { index: false },
};

export default function Page() {
  return <ShortlistPage />;
}
