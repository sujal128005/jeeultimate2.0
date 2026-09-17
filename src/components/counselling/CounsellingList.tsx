import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { counsellingProcesses } from "@/data/counselling";
import type { CounsellingProcess } from "@/types";

/** Compact glass rows linking to each counselling guide. */
export function CounsellingList({ items = counsellingProcesses }: { items?: CounsellingProcess[] }) {
  return (
    <Stagger as="ul" className="flex flex-col gap-3">
      {items.map((process) => (
        <StaggerItem as="li" key={process.slug}>
          <Link
            href={process.href}
            className="glass group flex items-center gap-4 rounded-lg p-4 transition-[transform,background-color] duration-(--duration-slow) ease-(--ease-out-soft) hover:-translate-y-0.5 hover:bg-surface/85 md:gap-5 md:p-5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-md bg-surface-2 text-fg shadow-hairline transition-all duration-(--duration-slow) group-hover:bg-accent-gradient md:size-14">
              <Icon name={process.icon} className="size-[22px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="type-h4 md:text-[26px]">{process.name}</h2>
                <Chip>{process.scope}</Chip>
              </div>
              <p className="mt-1 line-clamp-2 type-body-sm leading-[1.5] text-fg-muted">{process.summary}</p>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-contrast text-accent-on-contrast transition-transform duration-(--duration-base) group-hover:translate-x-0.5">
              <Icon name="arrow-right" className="size-4" />
            </span>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
