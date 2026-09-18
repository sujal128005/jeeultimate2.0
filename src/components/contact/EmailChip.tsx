"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * The address, in the open, with one tap to copy it. No form, because a form
 * would only send the same mail while hiding where it went.
 */
export function EmailChip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the address is written out beside this button anyway.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group/copy inline-flex h-9 max-w-full items-center gap-2 rounded-full bg-surface-2 pr-3 pl-3.5 type-caption font-medium text-fg-2 transition-colors hover:text-fg"
    >
      <span className="truncate font-[family-name:var(--font-mono)] text-[12px]">{address}</span>
      <Icon name={copied ? "check" : "link"} className={copied ? "size-3.5 text-accent-text" : "size-3.5 text-fg-subtle"} />
      <span className="sr-only">{copied ? "Address copied" : "Copy this address"}</span>
    </button>
  );
}
