import type { Metadata } from "next";
import { CareerFooter } from "@/components/career/CareerFooter";
import { CareerHero } from "@/components/career/CareerHero";
import { CareerNav } from "@/components/career/CareerNav";
import { CareerStory } from "@/components/career/CareerStory";
import { CareerWorld } from "@/components/career/CareerWorld";
import { RoleField } from "@/components/career/RoleField";
import { SignalTicker } from "@/components/career/SignalTicker";
import { TalentNetwork } from "@/components/career/TalentNetwork";

export const metadata: Metadata = {
  title: "Careers · Build with JEE Ultimate 2.0",
  description:
    "We’re building the future of JEE counselling. Engineers, AI builders, designers, content creators, counsellors and operators: join the JEE Ultimate 2.0 talent network.",
  alternates: { canonical: "/career" },
  openGraph: {
    title: "Build with JEE Ultimate 2.0",
    description: "We’re building the future of JEE counselling. Recruiting soon.",
  },
};

export default function CareerPage() {
  return (
    <CareerWorld>
      <CareerNav />
      <CareerHero />
      <SignalTicker />
      <CareerStory />
      <RoleField />
      <TalentNetwork />
      <CareerFooter />
    </CareerWorld>
  );
}
