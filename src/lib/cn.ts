/**
 * Tiny className joiner. Keeps the dependency list short -
 * swap for `clsx` + `tailwind-merge` if merging conflicts becomes common.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
