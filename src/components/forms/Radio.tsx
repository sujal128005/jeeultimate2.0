"use client";

import { createContext, useContext, useId } from "react";
import { cn } from "@/lib/cn";

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

type RadioGroupProps = {
  label: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  /** "cards" renders each option as a selectable tile */
  appearance?: "default" | "cards";
  className?: string;
  children: React.ReactNode;
};

export function RadioGroup({
  label,
  name,
  value,
  onValueChange,
  hint,
  error,
  disabled,
  orientation = "vertical",
  appearance = "default",
  className,
  children,
}: RadioGroupProps) {
  const autoName = useId();
  const hintId = useId();
  return (
    <RadioGroupContext.Provider value={{ name: name ?? autoName, value, onChange: onValueChange, disabled }}>
      <fieldset
        aria-describedby={hint || error ? hintId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn("flex flex-col gap-3", className)}
        disabled={disabled}
      >
        <legend className="mb-3 type-body-sm font-medium text-fg">{label}</legend>
        <div
          data-appearance={appearance}
          className={cn(
            "flex gap-2",
            orientation === "vertical" ? "flex-col" : "flex-wrap",
            appearance === "cards" && "gap-2.5",
          )}
        >
          {children}
        </div>
        {(error || hint) && (
          <p id={hintId} className={cn("type-caption", error ? "text-danger" : "text-fg-muted")}>
            {error ?? hint}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> & {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  card?: boolean;
};

export function Radio({ value, label, description, card, className, disabled, onChange, ...props }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const id = useId();
  const controlled = group?.value !== undefined;
  const isDisabled = disabled ?? group?.disabled;
  return (
    <label
      htmlFor={id}
      className={cn(
        "group/radio flex items-start gap-3",
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        card &&
          "rounded-card bg-surface/70 p-4 shadow-[inset_0_0_0_1px_var(--line-strong)] transition-shadow duration-(--duration-fast) has-[:checked]:shadow-[inset_0_0_0_1.5px_var(--fg)] has-[:focus-visible]:shadow-[inset_0_0_0_1.5px_var(--focus-ring)]",
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        value={value}
        name={group?.name}
        disabled={isDisabled}
        {...(controlled ? { checked: group?.value === value } : {})}
        onChange={(event) => {
          group?.onChange?.(value);
          onChange?.(event);
        }}
        className={cn(
          "mt-0.5 grid size-5 shrink-0 appearance-none place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1.5px_var(--line-strong)] transition-all duration-(--duration-fast)",
          "before:size-2 before:scale-0 before:rounded-full before:bg-on-contrast before:transition-transform before:duration-(--duration-fast) before:content-['']",
          "checked:bg-contrast checked:shadow-none checked:before:scale-100",
          "group-hover/radio:shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--fg)_35%,transparent)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        )}
        {...props}
      />
      <span className="flex flex-col gap-0.5">
        <span className="type-body-sm font-medium text-fg">{label}</span>
        {description && <span className="type-caption text-fg-muted">{description}</span>}
      </span>
    </label>
  );
}
