/**
 * Decides how much of the Career field a device should render.
 *  high   - desktop with headroom
 *  medium - typical laptops and good phones
 *  low    - older phones, data-saver
 *  static - reduced motion: one still frame per change
 *  none   - no WebGL: CSS fallback
 */
export type FieldTier = "high" | "medium" | "low" | "static" | "none";

export type FieldProfile = { tier: FieldTier; count: number; dpr: number };

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    const ok = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

export function detectFieldProfile(): FieldProfile {
  const nav = navigator as NavigatorExtras;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 767px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = Boolean(nav.connection?.saveData);
  const deviceDpr = window.devicePixelRatio || 1;

  if (!hasWebGL()) return { tier: "none", count: 0, dpr: 1 };
  if (reduced) return { tier: "static", count: small ? 6000 : 14000, dpr: Math.min(deviceDpr, 2) };
  if (saveData || cores <= 2 || memory <= 2) return { tier: "low", count: 3800, dpr: 1 };

  if (small || coarse) {
    return cores >= 6
      ? { tier: "medium", count: 8000, dpr: Math.min(deviceDpr, 1.5) }
      : { tier: "low", count: 4200, dpr: Math.min(deviceDpr, 1.25) };
  }
  return cores >= 8 && memory >= 8
    ? { tier: "high", count: 22000, dpr: Math.min(deviceDpr, 2) }
    : { tier: "medium", count: 14000, dpr: Math.min(deviceDpr, 1.5) };
}
