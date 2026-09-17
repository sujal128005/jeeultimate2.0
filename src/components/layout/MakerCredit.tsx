"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const IDLE = "Crafted by a human, not a template";
const REVEAL = "Sujal Negi · sujalnegi.tech ↗";
const HREF = "https://sujalnegi.tech";
const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEFXYZ";
const SPARK_COLORS = ["#ffb020", "#ff7a1a", "#ffffff", "#a98bff", "#7ce7ff", "#ff7ac6"];
const WIDTH = Math.max(IDLE.length, REVEAL.length);

type Burst = { id: number; x: number; y: number };

/**
 * The maker's signature. At rest it reads like a manifesto; on hover it
 * glitches, decodes into the maker's name, ignites a colour sweep and throws
 * sparks from the cursor. Click (or tap) opens sujalnegi.tech.
 */
export function MakerCredit({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(IDLE);
  const [active, setActive] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const frame = useRef(0);
  const ref = useRef<HTMLAnchorElement>(null);

  const scrambleTo = useCallback(
    (target: string) => {
      cancelAnimationFrame(frame.current);
      if (reduce) {
        setText(target);
        return;
      }
      const start = performance.now();
      const duration = 720;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        let out = "";
        for (let i = 0; i < WIDTH; i++) {
          const settle = i / WIDTH;
          const ch = target[i] ?? " ";
          if (p >= settle * 0.85 + 0.15) out += ch;
          else if (ch === " " && p > settle) out += " ";
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setText(p >= 1 ? target : out);
        if (p < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [reduce],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const ignite = (clientX?: number, clientY?: number) => {
    setActive(true);
    scrambleTo(REVEAL);
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = clientX !== undefined ? clientX - rect.left : rect.width / 2;
    const y = clientY !== undefined ? clientY - rect.top : rect.height / 2;
    const id = Date.now();
    setBursts((b) => [...b.slice(-2), { id, x, y }]);
    window.setTimeout(() => setBursts((b) => b.filter((burst) => burst.id !== id)), 1500);
  };

  const settle = () => {
    setActive(false);
    scrambleTo(IDLE);
  };

  return (
    <a
      ref={ref}
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Made by Sujal Negi, visit sujalnegi.tech (opens in a new tab)"
      onMouseEnter={(e) => ignite(e.clientX, e.clientY)}
      onMouseLeave={settle}
      onFocus={() => ignite()}
      onBlur={settle}
      data-active={active}
      className={cn("group/maker relative inline-flex items-center gap-2.5 rounded-full py-1.5 pr-3 pl-2 outline-offset-2", className)}
    >
      {/* Aurora behind the signature */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-(--duration-slow) group-data-[active=true]/maker:opacity-60"
        style={{
          background:
            "linear-gradient(90deg, rgb(255 176 32 / 0.35), rgb(169 139 255 / 0.35), rgb(124 231 255 / 0.35), rgb(255 122 198 / 0.35))",
          backgroundSize: "300% 100%",
          animation: active && !reduce ? "maker-flow 2.4s linear infinite" : undefined,
        }}
      />

      {/* Spark glyph */}
      <motion.svg
        aria-hidden
        viewBox="0 0 16 16"
        className="relative size-3.5 shrink-0"
        animate={active && !reduce ? { rotate: 180, scale: 1.35 } : { rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        <path
          d="M8 0c.5 4.2 3.8 7.5 8 8-4.2.5-7.5 3.8-8 8-.5-4.2-3.8-7.5-8-8 4.2-.5 7.5-3.8 8-8Z"
          fill={active ? "url(#maker-spark)" : "currentColor"}
          className="text-accent-on-contrast"
        />
        <defs>
          <linearGradient id="maker-spark" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffb020" />
            <stop offset="0.5" stopColor="#ff7ac6" />
            <stop offset="1" stopColor="#7ce7ff" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Fixed-width stage so decoding never shifts the layout */}
      <span className="relative inline-grid font-mono text-[12px] tracking-[0.02em] whitespace-pre">
        <span aria-hidden className="invisible col-start-1 row-start-1">
          {"M".repeat(WIDTH)}
        </span>
        <span
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 transition-[color] duration-(--duration-base)",
            active
              ? "bg-[linear-gradient(90deg,#ffb020,#ff7ac6,#a98bff,#7ce7ff,#ffb020)] bg-[length:200%_100%] bg-clip-text text-transparent [text-shadow:1px_0_rgb(255_60_90/0.35),-1px_0_rgb(80_220_255/0.35)]"
              : "text-current",
          )}
          style={active && !reduce ? { animation: "maker-flow 1.6s linear infinite" } : undefined}
        >
          {text}
        </span>
        {/* Underline draws on hover */}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#ffb020,#a98bff,#7ce7ff)] transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-data-[active=true]/maker:scale-x-100"
        />
      </span>

      {/* Spark bursts from the cursor */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <span key={burst.id} aria-hidden className="pointer-events-none absolute z-10" style={{ left: burst.x, top: burst.y }}>
            {/* Shockwave */}
            <motion.span
              className="absolute -top-10 -left-10 size-20 rounded-full border border-white/70"
              style={{ boxShadow: "0 0 18px rgb(255 176 32 / 0.6), inset 0 0 12px rgb(124 231 255 / 0.5)" }}
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            {Array.from({ length: 26 }).map((_, i) => {
              const angle = (i / 26) * Math.PI * 2 + (burst.id % 7) * 0.3;
              const distance = 34 + ((i * 37 + burst.id) % 56);
              const size = 3 + ((i * 13) % 5);
              return (
                <motion.span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    marginLeft: -size / 2,
                    marginTop: -size / 2,
                    background: SPARK_COLORS[i % SPARK_COLORS.length],
                    boxShadow: `0 0 8px ${SPARK_COLORS[i % SPARK_COLORS.length]}`,
                  }}
                  initial={{ x: 0, y: 0, scale: 1.4, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: [0, Math.sin(angle) * distance - 6, Math.sin(angle) * distance + 10],
                    scale: [1.4, 1.1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.1 + (i % 3) * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                    times: [0, 0.55, 1],
                  }}
                />
              );
            })}
          </span>
        ))}
      </AnimatePresence>
    </a>
  );
}
