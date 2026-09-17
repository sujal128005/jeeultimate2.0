import { Button, type ButtonProps } from "@/components/ui/Button";

/** Frosted button - for use over imagery, heroes and busy backgrounds. */
export function GlassButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...(props as ButtonProps)} variant="glass" />;
}
