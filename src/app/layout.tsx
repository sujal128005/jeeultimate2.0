import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { WorldTransitionProvider } from "@/components/motion/WorldTransition";
import { site } from "@/data/site";
import { worldColors } from "@/lib/tokens";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.headline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "JEE counselling",
    "JoSAA",
    "CSAB",
    "UPTAC",
    "JAC Delhi",
    "IIT admission",
    "NIT admission",
    "IIIT",
    "GFTI",
    "JEE Ultimate 2.0",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.headline}`,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.headline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: worldColors.site,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="glass-prominent fixed top-3 left-3 z-(--z-toast) -translate-y-20 rounded-full px-4 py-2 type-body-sm font-medium focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>
          <WorldTransitionProvider>
            <SiteChrome header={<Header />} footer={<Footer />}>
              {children}
            </SiteChrome>
          </WorldTransitionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
