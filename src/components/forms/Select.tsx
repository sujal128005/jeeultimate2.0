"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { controlSurface, useFieldControl } from "./Field";

export type SelectOption = { value: string; label: string; disabled?: boolean };

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  wrapperClassName?: string;
};

/**
 * Native select, styled. Native keeps full keyboard, screen-reader and
 * mobile picker support - use <Dropdown> for action menus instead.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, invalid, className, wrapperClassName, defaultValue, value, ...props },
  ref,
) {
  const { invalid: isInvalid, ...control } = useFieldControl({ ...props, invalid });
  void isInvalid;
  return (
    <div className={cn(controlSurface, "relative h-11", wrapperClassName)}>
      <select
        ref={ref}
        {...props}
        {...control}
        value={value}
        defaultValue={value === undefined ? (defaultValue ?? (placeholder ? "" : undefined)) : undefined}
        className={cn(
          "peer h-full w-full appearance-none bg-transparent pr-10 pl-3.5 type-body text-fg outline-none disabled:cursor-not-allowed",
          "invalid:text-fg-subtle [&>option]:bg-surface [&>option]:text-fg",
          className,
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-fg-muted transition-transform peer-focus:rotate-180"
      />
    </div>
  );
});
