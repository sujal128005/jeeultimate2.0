import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { colleges } from "@/data/colleges";
import { counsellingBySlug } from "@/data/counselling";
import type { CounsellingSlug } from "@/types";

type Search = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Reads `?college=` / `?counselling=` and names what the visitor came from. */
export function JourneyContext({ search, tool }: { search: Search; tool: string }) {
  const collegeSlug = first(search.college);
  const counsellingSlug = first(search.counselling);
  const college = collegeSlug ? colleges.find((c) => c.slug === collegeSlug) : undefined;
  const process = counsellingSlug ? counsellingBySlug[counsellingSlug as CounsellingSlug] : undefined;
  if (!college && !process) return null;

  const name = college?.name ?? `${process!.name} colleges`;
  const back = college ? `/colleges?q=${encodeURIComponent(college.name)}` : `/colleges?counselling=${process!.slug}`;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card bg-accent-soft/60 p-4 ring-1 ring-accent/25 sm:p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-gradient text-on-accent">
        <Icon name="info" className="size-4" />
      </span>
      <p className="min-w-0 flex-1 type-body-sm">
        You came here for <strong className="font-semibold">{name}</strong>. {tool} for it is on the way. Until then,
        official past ranks are linked on each{" "}
        <Link href="/counselling-support#resources" className="font-semibold text-accent-text underline-offset-2 hover:underline">
          counselling page
        </Link>
        .
      </p>
      <Link
        href={back}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-surface px-4 type-caption font-semibold shadow-hairline hover:bg-surface-2"
      >
        <Icon name="arrow-left" className="size-3.5" />
        Back to {college ? "college" : "colleges"}
      </Link>
    </div>
  );
}
