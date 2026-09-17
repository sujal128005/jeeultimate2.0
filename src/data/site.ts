export const site = {
  name: "JEE Ultimate 2.0",
  headline: "Your JEE Rank. Your College. Your Strategy.",
  description:
    "JEE Ultimate 2.0 helps students navigate college admissions and counselling for IITs, NITs, IIITs, GFTIs and other major engineering admission processes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  since: 2023,
  alumni: 10000,
  /**
   * Official logo. Drop the file into /public/brand and set the path here,
   * Official badge with the background removed. Replace the file to update it everywhere.
   */
  logoSrc: "/brand/jee-ultimate-2.0-logo.png" as string | null,
} as const;
