"use client";

import { useEffect, useRef, useState } from "react";
import { detectFieldProfile, type FieldProfile } from "@/lib/career/capabilities";
import { ParticleEngine } from "@/lib/career/particle-engine";
import { useCareerWorld } from "./CareerWorld";
import { StaticField } from "./StaticField";

/**
 * The fixed, full-viewport particle environment behind the Career page.
 * Loaded lazily; pauses when the tab is hidden; falls back to a CSS
 * composition when WebGL isn't available.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);
  // Rendered client-only (dynamic import with ssr: false), so window is available.
  const [profile] = useState<FieldProfile>(() => detectFieldProfile());
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const { scene, override } = useCareerWorld();

  // Boot
  useEffect(() => {
    const detected = profile;
    if (detected.tier === "none" || !canvasRef.current) return;

    let engine: ParticleEngine;
    try {
      engine = new ParticleEngine(canvasRef.current, {
        count: detected.count,
        dpr: detected.dpr,
        staticMode: detected.tier === "static",
        onFallback: () => setFailed(true),
      });
    } catch {
      const id = requestAnimationFrame(() => setFailed(true));
      return () => cancelAnimationFrame(id);
    }
    engineRef.current = engine;
    if (detected.tier !== "static") engine.start();
    const readyTimer = window.setTimeout(() => setReady(true), 60);

    const onResize = () => engine.resize();
    const onVisibility = () => (document.hidden ? engine.stop() : detected.tier !== "static" && engine.start());
    const toNdc = (x: number, y: number) => [(x / window.innerWidth) * 2 - 1, -((y / window.innerHeight) * 2 - 1)] as const;
    const onPointerMove = (event: PointerEvent) => {
      const [nx, ny] = toNdc(event.clientX, event.clientY);
      engine.setPointer(nx, ny, event.pointerType === "mouse" || event.buttons > 0 || event.pointerType === "touch");
    };
    const onPointerLeave = () => engine.setPointer(0, 0, false);
    const onTouchEnd = () => engine.setPointer(0, 0, false);

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchend", onTouchEnd);
      engine.dispose();
      engineRef.current = null;
    };
  }, [profile]);

  // Scene changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    const stage = mobile && scene.stageMobile ? scene.stageMobile : scene.stage;
    engine.setFormation(override?.formation ?? scene.formation);
    engine.setStage(stage);
    engine.setAccent(override?.accent ?? scene.accent ?? null);
  }, [scene, override, profile]);

  if (profile.tier === "none" || failed) return <StaticField />;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="size-full transition-opacity duration-[1.2s] ease-(--ease-out-soft)"
        style={{ opacity: ready ? 1 : 0 }}
      />
      {/* Atmosphere: vignette + a faint accent-coloured horizon */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgb(4_5_10/0.75)_100%)]" />
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] opacity-40 transition-[background] duration-[1.2s]"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 100%, color-mix(in oklab, var(--cw-accent) 22%, transparent), transparent)" }}
      />
      <div className="career-noise absolute inset-0 opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
