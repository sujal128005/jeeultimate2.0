/**
 * Particle formations for the Career field.
 * Each generator returns `count` points (xyz) inside roughly a unit-1.5 sphere.
 * Points are sorted top-to-bottom so morphs flow coherently instead of
 * scattering randomly.
 */

export type FormationName =
  | "sphere"
  | "chaos"
  | "terrain"
  | "helix"
  | "lattice"
  | "neural"
  | "knot"
  | "rings"
  | "vortex"
  | "orbit"
  | "mark";

type Vec3 = [number, number, number];
type Rng = () => number;

/** Deterministic PRNG so formations look identical on every load. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: Rng) => {
  const u = Math.max(r(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
};

const rotateX = ([x, y, z]: Vec3, a: number): Vec3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const rotateZ = ([x, y, z]: Vec3, a: number): Vec3 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

const generators: Record<FormationName, (i: number, n: number, r: Rng, ctx: Record<string, unknown>) => Vec3> = {
  /** A luminous sphere - every point a student */
  sphere(i, n, r) {
    if (r() < 0.14) {
      const rad = Math.cbrt(r()) * 1.05;
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      return [rad * Math.sin(ph) * Math.cos(th), rad * Math.cos(ph), rad * Math.sin(ph) * Math.sin(th)];
    }
    const y = 1 - (2 * (i + 0.5)) / n;
    const ring = Math.sqrt(1 - y * y);
    const phi = i * GOLDEN;
    const R = 1.28 * (0.95 + r() * 0.06);
    return [Math.cos(phi) * ring * R, y * R, Math.sin(phi) * ring * R];
  },

  /** The maze - tangled filaments and noise */
  chaos(_i, _n, r) {
    const strand = Math.floor(r() * 9);
    const t = r() * Math.PI * 2;
    const a = 1 + strand * 0.37;
    const b = 2 + (strand % 3);
    const base: Vec3 = [
      Math.sin(a * t + strand) * 1.9,
      Math.sin(b * t) * Math.cos(t * 0.5 + strand) * 1.25,
      Math.cos(a * t * 0.7 + strand * 2) * 1.1,
    ];
    const spread = r() < 0.25 ? 0.35 : 0.06;
    return [base[0] + gauss(r) * spread, base[1] + gauss(r) * spread, base[2] + gauss(r) * spread];
  },

  /** A mapped landscape - contour lines over a data terrain */
  terrain(_i, _n, r) {
    const rows = 30;
    const row = Math.floor(r() * rows);
    const z = -1.7 + (row / (rows - 1)) * 3.4;
    const x = (r() * 2 - 1) * 2.5;
    const y =
      0.34 * Math.sin(x * 1.5) * Math.cos(z * 1.8) +
      0.16 * Math.sin(x * 3.2 + z * 1.4) +
      0.5 * Math.exp(-((x - 0.6) ** 2 + (z + 0.2) ** 2) * 1.6);
    return rotateX([x, y - 0.1, z + gauss(r) * 0.008], -0.42);
  },

  /** Building blocks - a double helix */
  helix(_i, _n, r) {
    const t = r();
    const y = -1.7 + t * 3.4;
    const angle = t * Math.PI * 6;
    const R = 0.72;
    const pick = r();
    if (pick < 0.12) {
      const rung = Math.round(t * 26) / 26;
      const ay = -1.7 + rung * 3.4;
      const aa = rung * Math.PI * 6;
      const s = r() * 2 - 1;
      return [Math.cos(aa) * R * s, ay, Math.sin(aa) * R * s];
    }
    const phase = pick < 0.56 ? 0 : Math.PI;
    const tube = 0.07;
    return [
      Math.cos(angle + phase) * R + gauss(r) * tube,
      y + gauss(r) * tube * 0.5,
      Math.sin(angle + phase) * R + gauss(r) * tube,
    ];
  },

  /** Engineers - a structural lattice */
  lattice(_i, _n, r) {
    const cells = 6;
    const size = 2.3;
    const step = size / cells;
    const node = () => -size / 2 + Math.floor(r() * (cells + 1)) * step;
    const axis = Math.floor(r() * 3);
    const p: Vec3 = [node(), node(), node()];
    p[axis] = -size / 2 + r() * size;
    const jitter = 0.006;
    return rotateX(rotateZ([p[0] + gauss(r) * jitter, p[1] + gauss(r) * jitter, p[2] + gauss(r) * jitter], 0.18), 0.32);
  },

  /** AI builders - a neural network */
  neural(_i, _n, r, ctx) {
    const nodes = ctx.nodes as Vec3[];
    const edges = ctx.edges as [number, number][];
    if (r() < 0.42) {
      const node = nodes[Math.floor(r() * nodes.length)];
      const s = 0.045 + r() * 0.05;
      return [node[0] + gauss(r) * s, node[1] + gauss(r) * s, node[2] + gauss(r) * s];
    }
    const [a, b] = edges[Math.floor(r() * edges.length)];
    const t = r();
    const A = nodes[a];
    const B = nodes[b];
    const sag = Math.sin(t * Math.PI) * 0.06;
    return [A[0] + (B[0] - A[0]) * t + gauss(r) * 0.012, A[1] + (B[1] - A[1]) * t - sag, A[2] + (B[2] - A[2]) * t + gauss(r) * 0.012];
  },

  /** Designers - a flowing torus knot */
  knot(_i, _n, r) {
    const t = r() * Math.PI * 2;
    const p = 2;
    const q = 3;
    const R = 0.82;
    const tube = 0.3;
    const cx = (R + tube * Math.cos(q * t)) * Math.cos(p * t);
    const cy = (R + tube * Math.cos(q * t)) * Math.sin(p * t);
    const cz = tube * Math.sin(q * t) * 1.6;
    const s = 0.1 * Math.sqrt(r());
    const a = r() * Math.PI * 2;
    return rotateX([cx + Math.cos(a) * s, cy + Math.sin(a) * s, cz + gauss(r) * 0.03], 0.5);
  },

  /** Content creators - a broadcast of concentric rings */
  rings(_i, _n, r) {
    if (r() < 0.06) {
      const s = 0.09;
      return [gauss(r) * s, gauss(r) * s, gauss(r) * s];
    }
    const ring = Math.floor(Math.sqrt(r()) * 8);
    const radius = 0.28 + ring * 0.2;
    const a = r() * Math.PI * 2;
    const wave = Math.sin(a * 3 + ring) * 0.04;
    return rotateX([Math.cos(a) * radius, Math.sin(a) * radius, -ring * 0.06 + wave + gauss(r) * 0.01], 0.62);
  },

  /** Counsellors - many paths converging on one clear point */
  vortex(_i, _n, r) {
    const t = r();
    const y = 1.45 - t * 2.9;
    const radius = 0.04 + 1.35 * Math.pow(1 - t, 1.7);
    const strand = Math.floor(r() * 14);
    const a = (strand / 14) * Math.PI * 2 + t * 7.5;
    const spread = 0.025 + (1 - t) * 0.05;
    return [Math.cos(a) * radius + gauss(r) * spread, y, Math.sin(a) * radius + gauss(r) * spread];
  },

  /** Operators - a system in orbit */
  orbit(_i, _n, r) {
    const pick = r();
    if (pick < 0.26) {
      const rad = 0.34 * (0.85 + r() * 0.15);
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      return [rad * Math.sin(ph) * Math.cos(th), rad * Math.cos(ph), rad * Math.sin(ph) * Math.sin(th)];
    }
    const ring = pick < 0.5 ? 0 : pick < 0.75 ? 1 : 2;
    const radius = [0.8, 1.15, 1.5][ring];
    const tilt = [0.35, -0.55, 1.05][ring];
    const spin = [0, 0.9, -0.6][ring];
    const a = r() * Math.PI * 2;
    const p: Vec3 = [Math.cos(a) * radius, gauss(r) * 0.012, Math.sin(a) * radius];
    return rotateZ(rotateX(p, tilt), spin);
  },

  /** The JEE Ultimate 2.0 badge - a ring holding "2.0" */
  mark(_i, _n, r, ctx) {
    if (r() < 0.14) {
      // faint halo so the badge sits inside an atmosphere
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const rad = 1.9 + r() * 0.5;
      return [rad * Math.sin(ph) * Math.cos(th), rad * Math.cos(ph) * 0.75, rad * Math.sin(ph) * Math.sin(th) - 0.8];
    }
    const pixels = ctx.badge as Float32Array;
    const k = Math.floor(r() * (pixels.length / 2)) * 2;
    const jitter = 0.012;
    return [pixels[k] + gauss(r) * jitter, pixels[k + 1] + gauss(r) * jitter, gauss(r) * 0.05];
  },
};

/* ---------- shape helpers ---------- */

function neuralContext(r: Rng) {
  const nodes: Vec3[] = [];
  for (let i = 0; i < 20; i++) {
    const th = r() * Math.PI * 2;
    const ph = Math.acos(2 * r() - 1);
    const rad = 0.55 + r() * 0.8;
    nodes.push([rad * Math.sin(ph) * Math.cos(th) * 1.25, rad * Math.cos(ph), rad * Math.sin(ph) * Math.sin(th)]);
  }
  const edges: [number, number][] = [];
  nodes.forEach((a, ai) => {
    const nearest = nodes
      .map((b, bi) => ({ bi, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
      .filter((e) => e.bi !== ai)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3);
    nearest.forEach(({ bi }) => edges.push([ai, bi]));
  });
  return { nodes, edges };
}

/**
 * Rasterises the badge (outer ring, inner ring, "2.0") on a small canvas and
 * returns lit pixel positions in world units. Runs client-side only.
 */
function badgePixels(): Float32Array {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (!g) return new Float32Array([0, 0]);
  const c = size / 2;
  g.strokeStyle = "#fff";
  g.fillStyle = "#fff";
  g.lineWidth = 5;
  g.beginPath();
  g.arc(c, c, 118, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 2;
  g.beginPath();
  g.arc(c, c, 106, 0, Math.PI * 2);
  g.stroke();
  g.font = "800 92px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("2.0", c, c + 6);
  const data = g.getImageData(0, 0, size, size).data;
  const out: number[] = [];
  const scale = 1.35 / 118; // outer ring radius -> 1.35 world units
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (data[(y * size + x) * 4 + 3] > 140) out.push((x - c) * scale, -(y - c) * scale);
    }
  }
  return new Float32Array(out.length ? out : [0, 0]);
}

const cache = new Map<string, Float32Array>();

export function buildFormation(name: FormationName, count: number): Float32Array {
  const key = `${name}:${count}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const r = mulberry32(name.length * 7919 + count);
  const ctx: Record<string, unknown> = {};
  if (name === "neural") Object.assign(ctx, neuralContext(mulberry32(42)));
  if (name === "mark") ctx.badge = badgePixels();

  const points: Vec3[] = new Array(count);
  for (let i = 0; i < count; i++) points[i] = generators[name](i, count, r, ctx);
  // Coherent morphs: order top → bottom, with a slight diagonal bias
  points.sort((a, b) => b[1] + b[0] * 0.15 - (a[1] + a[0] * 0.15));

  const out = new Float32Array(count * 3);
  points.forEach((p, i) => out.set(p, i * 3));
  cache.set(key, out);
  return out;
}
