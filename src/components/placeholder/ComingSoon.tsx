import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { NavLink } from "@/components/layout/NavLink";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { mainNav } from "@/data/navigation";
import type { SectionPage } from "@/types";
import { GhostPreview } from "./GhostPreview";
import { PageShell } from "./PageShell";

/**
 * Phase-1 page template for navigation sections that are still being built.
 * Pass `children` to render real content (e.g. the counselling list) above the preview.
 */
export function ComingSoon({
  page,
  children,
  showPreview = true,
}: {
  page: SectionPage;
  children?: React.ReactNode;
  showPreview?: boolean;
}) {
  const others = mainNav.filter((item) => item.href !== page.href);

  return (
    <PageShell>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <AnimatedSection className="min-w-0 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-accent-gradient grid size-11 place-items-center rounded-md text-on-accent shadow-accent">
                <Icon name={page.icon} className="size-5" />
              </span>
              <Eyebrow>{page.eyebrow}</Eyebrow>
            </div>

            <h1 className="mt-7 type-h1">
              {page.title}
            </h1>
            <p className="mt-6 max-w-[30rem] type-body-lg text-fg-muted">
              {page.description}
            </p>

            <StatusBadge className="mt-8">Coming in the next phase</StatusBadge>

            <div className="mt-10 border-t border-line pt-7">
              <p className="type-label text-fg-muted">Planned for this space</p>
              <Stagger as="ul" className="mt-5 flex flex-col gap-3.5">
                {page.planned.map((item) => (
                  <StaggerItem as="li" key={item} className="flex items-start gap-3 type-body text-fg">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">
                      <Icon name="check" className="size-3" strokeWidth={2.75} />
                    </span>
                    {item}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/" variant="glass" leadingIcon="arrow-left">
                Back to home
              </Button>
              {page.href !== "/counselling-support" && (
                <Button href="/counselling-support" icon="arrow-right">
                  Counselling support
                </Button>
              )}
            </div>
          </div>
        </AnimatedSection>

        <div className="flex min-w-0 flex-col gap-8 lg:col-span-7">
          {children}
          {showPreview && (
          <AnimatedSection delay={0.15}>
            <GlassPanel variant="standard" radius="2xl" className="relative p-3 md:p-4">
              <div className="flex items-center justify-between px-2 pt-1 pb-4 md:px-3">
                <span className="type-label text-fg-muted">Preview</span>
                <Badge tone="neutral" dot>
                  In design
                </Badge>
              </div>
              <GhostPreview kind={page.preview} className="h-[440px] overflow-hidden rounded-lg md:h-[540px]" />
            </GlassPanel>
          </AnimatedSection>
          )}
        </div>
      </div>

      <AnimatedSection className="mt-24 border-t border-line pt-10 md:mt-32">
        <p className="type-label text-fg-muted">Explore JEE Ultimate 2.0</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => (
            <li key={item.id}>
              <NavLink
                item={item}
                className="group flex items-center gap-3 rounded-md p-3 transition-colors duration-(--duration-base) hover:bg-surface/80"
              >
                <span className="grid size-10 place-items-center rounded-sm bg-surface-2 text-fg-2 shadow-hairline transition-colors group-hover:text-fg">
                  <Icon name={item.icon} className="size-[18px]" />
                </span>
                <span className="flex-1 type-body-sm font-medium">{item.label}</span>
                <Icon
                  name="arrow-right"
                  className="size-4 text-fg-subtle transition-all duration-(--duration-base) group-hover:translate-x-0.5 group-hover:text-fg"
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </AnimatedSection>
    </PageShell>
  );
}
