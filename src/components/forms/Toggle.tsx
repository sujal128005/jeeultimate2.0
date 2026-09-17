"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";

type ToggleProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
};

/** On/off switch (role="switch"). */
export function Toggle({
  label,
  description,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  hideLabel,
  className,
}: ToggleProps) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const id = useId();
  const descId = description ? `${id}-desc` : undefined;

  return (
    <div className={cn("flex items-start justify-between gap-4", disabled && "opacity-50", className)}>
      <div className={cn("flex flex-col gap-0.5", hideLabel && "sr-only")}>
        <label htmlFor={id} className="type-body-sm font-medium text-fg">
          {label}
        </label>
        {description && (
          <span id={descId} className="type-caption text-fg-muted">
            {description}
          </span>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={descId}
        disabled={disabled}
        onClick={() => {
          const next = !on;
          if (checked === undefined) setInner(next);
          onCheckedChange?.(next);
        }}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-(--duration-base) ease-(--ease-out-soft) disabled:cursor-not-allowed",
          on ? "bg-contrast" : "bg-fg/[0.12] hover:bg-fg/[0.16]",
        )}
      >
        <motion.span
          layout
          transition={spring.toggle}
          className={cn(
            "block size-6 rounded-full bg-surface shadow-[0_1px_3px_rgb(14_14_16/0.25),0_0_0_0.5px_rgb(14_14_16/0.04)]",
            on && "ml-auto",
          )}
        >
          <span
            className={cn(
              "m-auto mt-[9px] block size-1.5 rounded-full transition-opacity duration-(--duration-base)",
              on ? "bg-accent opacity-100" : "opacity-0",
            )}
          />
        </motion.span>
      </button>
    </div>
  );
}
