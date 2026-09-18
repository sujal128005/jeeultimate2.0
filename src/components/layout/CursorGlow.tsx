"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};
const SIZE = 520;
/** Ink marks left behind the cursor */
const TRAIL = 10;
const TRAIL_LEN = 300;
const TRAIL_THICK = 116;
const TRAIL_LIFE = 1800;
/** A new mark only once the cursor has travelled this far */
const TRAIL_GAP = 46;
/** Stillness before the light starts breathing, and the length of one breath */
const IDLE_AFTER = 700;
const BREATH = 5.2;

/** True only for a real mouse or trackpad, so phones never pay for this. */
function useFinePointer() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false,
  );
}

/**
 * A warm light that drifts after the cursor, stretching along the direction
 * it travels and leaving ink-like strokes that bleed out over a second or two.
 * Pointer position is written straight to motion values and to element
 * transforms, so moving the mouse never re-renders React.
 */
export function CursorGlow() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const on = mounted && fine && !reduced;

  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const opacity = useMotionValue(0);
  // Low stiffness with heavy damping: it follows, it never snaps or wobbles.
  const sx = useSpring(x, { stiffness: 55, damping: 22, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 55, damping: 22, mass: 0.7 });
  const sOpacity = useSpring(opacity, { stiffness: 90, damping: 26 });

  // Speed drags the light out of round, the way ink smears when it is pulled.
  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const speed = useTransform<number, number>([vx, vy], ([a, b]) => Math.min(Math.hypot(a, b) / 2400, 1));
  const heading = useMotionValue(0);
  useEffect(() => {
    const read = () => {
      const a = vx.get();
      const b = vy.get();
      // Only re-aim while actually moving, so it does not spin when idle.
      if (Math.hypot(a, b) < 120) return;
      const next = (Math.atan2(b, a) * 180) / Math.PI;
      const prev = heading.get();
      const delta = ((next - prev + 540) % 360) - 180;
      heading.set(prev + delta);
    };
    const un1 = vx.on("change", read);
    const un2 = vy.on("change", read);
    return () => {
      un1();
      un2();
    };
  }, [vx, vy, heading]);

  const rotate = useSpring(heading, { stiffness: 90, damping: 24, mass: 0.6 });
  const stretchX = useSpring(
    useTransform(speed, (s) => 1 + s * 0.55),
    { stiffness: 120, damping: 26 },
  );
  const stretchY = useSpring(
    useTransform(speed, (s) => 1 - s * 0.24),
    { stiffness: 120, damping: 26 },
  );

  // Left alone, the light breathes: a slow swell and a dim, in and out.
  const breath = useMotionValue(1);
  const breathFade = useMotionValue(1);
  const scaleX = useTransform<number, number>([stretchX, breath], ([a, b]) => a * b);
  const scaleY = useTransform<number, number>([stretchY, breath], ([a, b]) => a * b);
  const glowOpacity = useTransform<number, number>([sOpacity, breathFade], ([a, b]) => a * b);

  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!on) return;
    const marks = Array.from(trailRef.current?.children ?? []) as HTMLElement[];
    let slot = 0;
    let lastX = 0;
    let lastY = 0;
    let first = true;
    let idleTimer = 0;
    let breathing: { stop: () => void } | null = null;

    const startBreathing = () => {
      if (breathing) return;
      const loop = { duration: BREATH, repeat: Infinity, ease: "easeInOut" as const };
      const a = animate(breath, [1, 1.08, 1], loop);
      const b = animate(breathFade, [1, 0.74, 1], loop);
      breathing = { stop: () => { a.stop(); b.stop(); } };
    };

    const stopBreathing = () => {
      if (!breathing) return;
      breathing.stop();
      breathing = null;
      animate(breath, 1, { duration: 0.45, ease: "easeOut" });
      animate(breathFade, 1, { duration: 0.35, ease: "easeOut" });
    };

    const stamp = (cx: number, cy: number, angle: number, stretch: number) => {
      const mark = marks[slot % marks.length];
      slot += 1;
      if (!mark) return;
      // Ink is never tidy: nudge each stroke's angle and weight a little.
      const jitter = (Math.random() - 0.5) * 14;
      const weight = 0.86 + Math.random() * 0.3;
      mark.style.transform =
        `translate3d(${cx - TRAIL_LEN / 2}px, ${cy - TRAIL_THICK / 2}px, 0)` +
        ` rotate(${angle + jitter}deg) scale(${stretch}, ${weight})`;
      for (const child of Array.from(mark.children) as HTMLElement[]) {
        const late = child.dataset.bleed === "1";
        child.animate(
          [
            { opacity: late ? 0.22 : 0.46, transform: "scale(0.86, 0.9)" },
            { opacity: late ? 0.2 : 0.3, transform: "scale(1, 1)", offset: 0.24 },
            { opacity: 0, transform: late ? "scale(1.5, 1.34)" : "scale(1.28, 1.2)" },
          ],
          {
            duration: late ? TRAIL_LIFE + 500 : TRAIL_LIFE,
            easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
            fill: "forwards",
          },
        );
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (first) {
        // Start where the cursor already is, so it does not fly in from a corner.
        x.jump(e.clientX);
        y.jump(e.clientY);
        sx.jump(e.clientX);
        sy.jump(e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        first = false;
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const travelled = Math.hypot(dx, dy);
        if (travelled > TRAIL_GAP) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          // A longer jump between samples means a faster hand: draw a longer stroke.
          const stretch = Math.min(0.72 + travelled / 150, 1.5);
          lastX = e.clientX;
          lastY = e.clientY;
          stamp(e.clientX, e.clientY, angle, stretch);
        }
      }
      opacity.set(1);
      stopBreathing();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startBreathing, IDLE_AFTER);
    };
    const leave = () => {
      opacity.set(0);
      window.clearTimeout(idleTimer);
      stopBreathing();
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.clearTimeout(idleTimer);
      breathing?.stop();
    };
  }, [on, x, y, sx, sy, opacity, breath, breathFade]);

  if (!on) return null;

  return createPortal(
    <>
      <div ref={trailRef} aria-hidden className="cursor-trail">
        {Array.from({ length: TRAIL }, (_, i) => (
          <div key={i} className="cursor-trail-mark" style={{ width: TRAIL_LEN, height: TRAIL_THICK }}>
            <span className="cursor-trail-ink" />
          </div>
        ))}
      </div>
      <motion.div
        aria-hidden
        className="cursor-glow"
        style={{ x: sx, y: sy, rotate, scaleX, scaleY, opacity: glowOpacity, width: SIZE, height: SIZE }}
      >
        <span className="cursor-glow-layer cursor-glow-warm" />
        <span className="cursor-glow-layer cursor-glow-lift" />
      </motion.div>
    </>,
    document.body,
  );
}
