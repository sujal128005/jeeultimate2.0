import type { Metadata } from "next";
import "@/styles/workspace.css";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

/** The workspace brings its own chrome and its own plain skin. */
export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return children;
}
