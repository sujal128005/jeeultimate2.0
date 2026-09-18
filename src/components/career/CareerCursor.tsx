"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};
const pad = (n: number) => Math.round(Math.max(n, 0)).toString().padStart(4, "0");

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
 * The Career world's own cursor: a targeting reticle with a live readout.
 * Only for a real mouse, and only while this component is mounted, which is
 * the Career route alone. The native cursor is hidden by the class it sets.
 */
export function CareerCursor() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const on = mounted && fine && !reduced;

  const [mode, setMode] = useState<"idle" | "target" | "text">("idle");
  const [down, setDown] = useState(false);
  const [live, setLive] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useMotionValue(-200);
  const ry = useMotionValue(-200);
  // The dot is quick, the frame lags a touch behind it.
  const dotX = useSpring(x, { stiffness: 900, damping: 42, mass: 0.35 });
  const dotY = useSpring(y, { stiffness: 900, damping: 42, mass: 0.35 });
  const ringX = useSpring(x, { stiffness: 210, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 210, damping: 26, mass: 0.6 });
  const readout = useMotionTemplate`X:${useTransform(rx, pad)}  Y:${useTransform(ry, pad)}`;

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add("career-cursor");
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      rx.set(e.clientX);
      ry.set(e.clientY);
      if (!live) setLive(true);
      const el = e.target as Element | null;
      const hit = el?.closest?.("a, button, [role='button'], summary, label");
      const typing = el?.closest?.("input, textarea, [contenteditable='true']");
      setMode(typing ? "text" : hit ? "target" : "idle");
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setLive(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("career-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [on, x, y, rx, ry, live]);

  if (!on) return null;

  const frame = mode === "target" ? 30 : mode === "text" ? 12 : 21;

  return createPortal(
    <div aria-hidden className="career-cursor-root" style={{ opacity: live ? 1 : 0 }}>
      {/* Bracketed frame, lagging slightly behind the pointer */}
      <motion.div className="career-cursor-frame" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="career-cursor-brackets"
          animate={{
            width: frame * 2,
            height: mode === "text" ? 46 : frame * 2,
            rotate: mode === "target" ? 45 : 0,
            opacity: down ? 1 : 0.75,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          <span /> <span /> <span /> <span />
        </motion.div>
        <motion.span
          className="career-cursor-readout"
          animate={{ opacity: mode === "idle" ? 0.55 : 0.9, y: mode === "target" ? 42 : 34 }}
          transition={{ duration: 0.25 }}
        >
          <motion.span>{readout}</motion.span>
          {mode === "target" && <span className="career-cursor-tag">OPEN</span>}
        </motion.span>
      </motion.div>

      {/* The dot itself, right under the hand */}
      <motion.div className="career-cursor-dot" style={{ x: dotX, y: dotY }}>
        <motion.span
          animate={{ scale: down ? 0.5 : mode === "target" ? 1.6 : 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 28 }}
        />
      </motion.div>
    </div>,
    document.body,
  );
}
