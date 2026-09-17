"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import { variants } from "@/lib/motion";

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown parts must be used inside <Dropdown>");
  return ctx;
}

/**
 * Accessible dropdown menu.
 * - Click / Enter / Space / ArrowDown to open
 * - Arrow keys + Home/End to move, Escape or outside click to close
 */
export function Dropdown({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, menuId, triggerRef }}>
      <div ref={rootRef} className={cn("relative", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({
  className,
  children,
  label,
}: {
  className?: string | ((open: boolean) => string);
  children: React.ReactNode | ((open: boolean) => React.ReactNode);
  label: string;
}) {
  const { open, setOpen, menuId, triggerRef } = useDropdown();
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      onClick={() => setOpen(!open)}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
        }
      }}
      className={typeof className === "function" ? className(open) : className}
    >
      {typeof children === "function" ? children(open) : children}
    </button>
  );
}

export function DropdownMenu({
  children,
  className,
  align = "end",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
  label: string;
}) {
  const { open, menuId, setOpen, triggerRef } = useDropdown();
  const menuRef = useRef<HTMLDivElement>(null);

  const focusItem = useCallback((index: number | "first" | "last") => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    if (!items.length) return;
    const target =
      index === "first" ? 0 : index === "last" ? items.length - 1 : (index + items.length) % items.length;
    items[target]?.focus();
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => focusItem("first"));
  }, [open, focusItem]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const current = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem("first");
        break;
      case "End":
        event.preventDefault();
        focusItem("last");
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('[role="menuitem"]')) {
              setOpen(false);
              triggerRef.current?.focus({ preventScroll: true });
            }
          }}
          variants={variants.menu}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "glass-prominent absolute top-[calc(100%+10px)] z-(--z-dropdown) rounded-lg p-1.5",
            align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DropdownItem({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      tabIndex={-1}
      className={cn(
        "group/item flex items-center gap-3 rounded-md p-2.5 outline-none transition-colors duration-(--duration-fast) hover:bg-fg/[0.045] focus-visible:bg-fg/[0.06] focus-visible:shadow-[inset_0_0_0_1.5px_var(--focus-ring)] focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </Link>
  );
}
