"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { controlSurface, useFieldControl } from "./Field";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  wrapperClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, wrapperClassName, rows = 4, ...props },
  ref,
) {
  const { invalid: isInvalid, ...control } = useFieldControl({ ...props, invalid });
  void isInvalid;
  return (
    <div className={cn(controlSurface, wrapperClassName)}>
      <textarea
        ref={ref}
        rows={rows}
        {...props}
        {...control}
        className={cn(
          "block w-full resize-y bg-transparent px-3.5 py-3 type-body text-fg outline-none [field-sizing:content] min-h-24 placeholder:text-fg-subtle disabled:cursor-not-allowed",
          className,
        )}
      />
    </div>
  );
});
