"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { roleOptions } from "@/data/navigation";
import { cn } from "@/lib/cn";

/** Sign-in entry point. UI only in Phase 1 - each role links to a placeholder portal. */
export function ProfileMenu() {
  return (
    <Dropdown>
      <DropdownTrigger
        label="Sign in"
        className={(open) =>
          cn(
            "glass glass-interactive group/trigger grid size-11 place-items-center rounded-full text-fg-2 hover:text-fg",
            open && "text-fg ring-2 ring-accent/60 ring-offset-2 ring-offset-canvas",
          )
        }
      >
        <Icon name="user" className="size-[19px]" />
      </DropdownTrigger>

      <DropdownMenu label="Choose a workspace" className="w-[292px]">
        <div className="px-3 pt-2.5 pb-3">
          <p className="type-body-sm font-semibold text-fg">Sign in to JEE Ultimate 2.0</p>
          <p className="mt-0.5 type-caption text-fg-muted">Choose your workspace</p>
        </div>
        <div className="h-px bg-line" />
        <div className="flex flex-col gap-0.5 py-1.5">
          {roleOptions.map((role) => (
            <DropdownItem key={role.id} href={role.href}>
              <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-surface-2 text-fg-2 shadow-hairline transition-colors duration-(--duration-base) group-hover/item:bg-accent-gradient group-hover/item:text-on-accent group-focus-visible/item:bg-accent-gradient group-focus-visible/item:text-on-accent">
                <Icon name={role.icon} className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block type-body-sm font-medium tracking-[-0.015em] text-fg">{role.label}</span>
                <span className="block truncate type-caption text-fg-muted">{role.description}</span>
              </span>
              <Icon
                name="chevron-right"
                className="size-4 text-fg-subtle transition-transform duration-(--duration-base) group-hover/item:translate-x-0.5 group-hover/item:text-fg"
              />
            </DropdownItem>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-md bg-surface-2/80 px-3 py-2.5 type-caption text-fg-muted">
          <Icon name="lock" className="size-3.5" />
          Secure sign-in arrives in the next phase.
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
