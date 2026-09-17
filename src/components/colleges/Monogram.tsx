import type { College } from "@/lib/colleges/model";
import { INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";

/** Periodic-table style badge in the institute type's colour. */
export function Monogram({ college, size = "md" }: { college: College; size?: "md" | "sm" }) {
  const t = INSTITUTE_TYPES[college.type];
  const { top, symbol } = college.monogram;
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
        size === "md" ? "size-14 px-2 pt-2 pb-1.5" : "size-11 px-1.5 pt-1.5 pb-1",
      )}
      style={{ background: `linear-gradient(145deg, ${t.color}, color-mix(in oklab, ${t.color} 55%, #0e0e10))` }}
    >
      <span className="truncate font-mono text-[8.5px] leading-none tracking-wide opacity-80">{top || t.label}</span>
      <span
        className={cn(
          "self-end leading-none font-semibold tracking-[-0.04em]",
          size === "md" ? (symbol.length > 3 ? "text-[15px]" : "text-[22px]") : symbol.length > 3 ? "text-[12px]" : "text-[17px]",
        )}
      >
        {symbol}
      </span>
    </span>
  );
}
