"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { roleOptions } from "@/data/navigation";
import { cn } from "@/lib/cn";

/** The three workspaces, in the order people ask for them. */
const ORDER = ["admin", "mentor", "team"];
const workspaces = ORDER.map((id) => roleOptions.find((r) => r.id === id)).filter((r) => r !== undefined);

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

      <DropdownMenu label="Choose a workspace" className="w-[240px]">
        <div className="px-3 pt-2.5 pb-2">
          <p className="type-body-sm font-semibold text-fg">JEE Ultimate 2.0 workspace</p>
        </div>
        <div className="h-px bg-line" />
        <div className="flex flex-col gap-0.5 py-1.5">
          {workspaces.map((role) => (
            <DropdownItem key={role.id} href={role.href}>
              <span className="min-w-0 flex-1 type-body-sm font-medium tracking-[-0.015em] text-fg">{role.label}</span>
              <Icon
                name="chevron-right"
                className="size-4 text-fg-subtle transition-transform duration-(--duration-base) group-hover/item:translate-x-0.5 group-hover/item:text-fg"
              />
            </DropdownItem>
          ))}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
