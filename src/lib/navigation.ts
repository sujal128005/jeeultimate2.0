import type { NavItem } from "@/types";

/** True when the current path belongs to a nav item (including nested routes). */
export function isNavItemActive(pathname: string, item: NavItem) {
  const prefixes = [item.href, ...(item.matches ?? [])];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
