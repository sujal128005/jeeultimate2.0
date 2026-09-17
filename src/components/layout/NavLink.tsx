"use client";

import Link from "next/link";
import { WorldLink } from "@/components/motion/WorldTransition";
import type { NavItem } from "@/types";

/** Link for a nav item - uses the world transition when the item needs it. */
export function NavLink({
  item,
  ...props
}: { item: Pick<NavItem, "href" | "world"> } & Omit<React.ComponentProps<typeof Link>, "href">) {
  if (item.world) return <WorldLink href={item.href} world={item.world} {...props} />;
  return <Link href={item.href} {...props} />;
}
