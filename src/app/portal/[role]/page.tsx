import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { PageShell } from "@/components/placeholder/PageShell";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { roleOptions } from "@/data/navigation";
import { portalCopy } from "@/data/sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return roleOptions.map(({ id }) => ({ role: id }));
}

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function PortalPage(props: PageProps<"/portal/[role]">) {
  const { role } = await props.params;
  const option = roleOptions.find((r) => r.id === role);
  if (!option) notFound();
  const copy = portalCopy[option.id];

  return (
    <PageShell>
      <AnimatedSection className="mx-auto max-w-[480px]">
        <GlassPanel tone="strong" radius="2xl" className="p-8 text-center md:p-10">
          <span className="bg-accent-gradient mx-auto grid size-16 place-items-center rounded-lg text-on-accent shadow-accent">
            <Icon name={copy.icon} className="size-7" />
          </span>
          <p className="mt-7 type-label text-fg-muted">{option.label} sign-in</p>
          <h1 className="mt-3 type-h3">{copy.title}</h1>
          <p className="mt-3 type-body text-fg-muted">{copy.body}</p>

          {/* Placeholder fields - no authentication in Phase 1 */}
          <div aria-hidden className="mt-8 flex flex-col gap-3 text-left">
            {["Email", "Password"].map((label) => (
              <div key={label} className="rounded-md bg-surface/80 px-4 py-3 shadow-hairline">
                <span className="text-[11.5px] font-medium text-fg-subtle">{label}</span>
                <span className="mt-1.5 block h-2 w-2/5 rounded-full bg-fg/[0.06]" />
              </div>
            ))}
            <span className="mt-1 flex h-12 items-center justify-center gap-2 rounded-full bg-fg/10 type-body-sm font-medium text-fg/40">
              <Icon name="lock" className="size-4" />
              Sign in
            </span>
          </div>

          <StatusBadge className="mt-8">Sign-in arrives in the next phase</StatusBadge>
        </GlassPanel>
        <div className="mt-6 flex justify-center">
          <Button href="/" variant="ghost" leadingIcon="arrow-left">
            Back to home
          </Button>
        </div>
      </AnimatedSection>
    </PageShell>
  );
}
