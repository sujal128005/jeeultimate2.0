"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { FormationName } from "@/lib/career/formations";
import type { Stage } from "@/lib/career/particle-engine";

/**
 * The Career world's shared state: which formation the particle field shows,
 * where it sits, and which accent colour is active. Sections declare what they
 * want with <FieldScene>; the scene nearest the viewport centre wins.
 */

export type SceneRequest = {
  formation: FormationName;
  /** Stage on large screens */
  stage: Stage;
  /** Stage on phones */
  stageMobile?: Stage;
  accent?: string | null;
};

type Override = { formation: FormationName; accent: string | null } | null;

type CareerWorldValue = {
  scene: SceneRequest;
  override: Override;
  setOverride: (value: Override) => void;
  register: (id: string, el: HTMLElement, request: SceneRequest) => () => void;
  activeId: string | null;
};

const CareerWorldContext = createContext<CareerWorldValue | null>(null);

const ParticleField = dynamic(() => import("./ParticleField").then((m) => m.ParticleField), {
  ssr: false,
  loading: () => null,
});

const initialScene: SceneRequest = {
  formation: "sphere",
  stage: { x: 0.95, y: 0.05, scale: 1.05, dim: 1 },
  stageMobile: { x: 0, y: 0.55, scale: 0.78, dim: 0.9 },
};

export function CareerWorld({ children }: { children: React.ReactNode }) {
  const scenes = useRef(new Map<string, { el: HTMLElement; request: SceneRequest }>());
  const [active, setActive] = useState<{ id: string; request: SceneRequest } | null>(null);
  const activeId = active?.id ?? null;
  const [override, setOverride] = useState<Override>(null);

  const pick = useCallback(() => {
    const mid = window.innerHeight * 0.5;
    let best: string | null = null;
    let bestDistance = Infinity;
    scenes.current.forEach(({ el }, id) => {
      const rect = el.getBoundingClientRect();
      const distance = rect.top <= mid && rect.bottom >= mid ? 0 : Math.min(Math.abs(rect.top - mid), Math.abs(rect.bottom - mid));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = id;
      }
    });
    const chosen: string | null = best;
    const entry = chosen ? scenes.current.get(chosen) : undefined;
    setActive((current) => {
      if (!chosen || !entry) return null;
      if (current?.id === chosen && current.request === entry.request) return current;
      return { id: chosen, request: entry.request };
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };
    frame = requestAnimationFrame(pick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pick]);

  const register = useCallback<CareerWorldValue["register"]>(
    (id, el, request) => {
      scenes.current.set(id, { el, request });
      requestAnimationFrame(pick);
      return () => {
        scenes.current.delete(id);
      };
    },
    [pick],
  );

  const scene = active?.request ?? initialScene;

  const value = useMemo(
    () => ({ scene, override, setOverride, register, activeId }),
    [scene, override, register, activeId],
  );

  const accent = override?.accent ?? scene.accent ?? null;

  return (
    <CareerWorldContext.Provider value={value}>
      <div
        data-world="career"
        className="relative isolate min-h-dvh overflow-x-clip"
        style={accent ? ({ "--cw-accent": accent } as React.CSSProperties) : undefined}
      >
        <ParticleField />
        {children}
      </div>
    </CareerWorldContext.Provider>
  );
}

export function useCareerWorld() {
  const ctx = useContext(CareerWorldContext);
  if (!ctx) throw new Error("useCareerWorld must be used inside <CareerWorld>");
  return ctx;
}

/** Declares the particle scene for a section of the page. */
export function FieldScene({
  id,
  request,
  as: Component = "section",
  className,
  children,
  ...props
}: {
  id: string;
  request: SceneRequest;
  as?: "section" | "div" | "header" | "footer";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "id">) {
  const ref = useRef<HTMLElement>(null);
  const { register } = useCareerWorld();
  const requestKey = JSON.stringify(request);

  useEffect(() => {
    if (!ref.current) return;
    return register(id, ref.current, JSON.parse(requestKey) as SceneRequest);
  }, [id, register, requestKey]);

  return (
    <Component ref={ref as React.Ref<never>} id={id} className={className} {...props}>
      {children}
    </Component>
  );
}
