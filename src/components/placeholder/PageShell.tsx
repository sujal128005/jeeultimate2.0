import { Container } from "@/components/ui/Container";

/** Shared top-of-page frame for inner routes: grid backdrop + header offset. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[720px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute top-[-30%] left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full glow-accent" />
      </div>
      <Container size="wide" className="relative pt-[112px] pb-section-sm md:pt-[150px] md:pb-section">
        {children}
      </Container>
    </div>
  );
}
