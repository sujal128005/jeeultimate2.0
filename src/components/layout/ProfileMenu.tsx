import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/**
 * The staff door. One button, straight to the workspace sign-in, where you say
 * who you are and type your code. Students never need this.
 */
export function ProfileMenu() {
  return (
    <Link
      href="/portal/signin"
      aria-label="Team log in"
      title="Team log in"
      className="glass glass-interactive group/login grid size-11 place-items-center rounded-full text-fg-2 transition-colors duration-(--duration-base) hover:text-fg"
    >
      <Icon
        name="user"
        className="size-[19px] transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover/login:scale-110"
      />
    </Link>
  );
}
