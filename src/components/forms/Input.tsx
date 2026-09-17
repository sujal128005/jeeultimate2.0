"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { controlSurface, useFieldControl } from "./Field";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  leadingIcon?: IconName;
  trailing?: React.ReactNode;
  invalid?: boolean;
  size?: "md" | "lg";
  wrapperClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leadingIcon, trailing, invalid, size = "md", className, wrapperClassName, ...props },
  ref,
) {
  const { invalid: isInvalid, ...control } = useFieldControl({ ...props, invalid });
  return (
    <div className={cn(controlSurface, "flex items-center", size === "lg" ? "h-13" : "h-11", wrapperClassName)}>
      {leadingIcon && <Icon name={leadingIcon} className="ml-3.5 size-4 shrink-0 text-fg-muted" />}
      <input
        ref={ref}
        {...props}
        {...control}
        data-invalid={isInvalid || undefined}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent px-3.5 type-body text-fg outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed",
          leadingIcon && "pl-2.5",
          className,
        )}
      />
      {trailing && <div className="mr-1.5 flex shrink-0 items-center">{trailing}</div>}
    </div>
  );
});
