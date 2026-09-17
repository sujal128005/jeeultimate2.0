import { buildFormation, type FormationName } from "./formations";

/**
 * A small, dependency-free WebGL particle engine.
 * - One draw call (gl.POINTS), additive blending
 * - Morphs happen on the GPU: two position buffers + a progress uniform
 * - Cursor "decode": particles near the pointer (and along its trail) become
 *   cycling glyphs 0-9 !@#$%^&*, with click shockwaves and an ambient scan line
 * - Gentle drift, breathing shimmer, travelling wave, slow rotation
 * - Adaptive quality: drops resolution if frames run long
 */

export type Stage = {
  /** World-space offset of the formation */
  x: number;
  y: number;
  /** Uniform scale */
  scale: number;
  /** Brightness multiplier (lower behind text) */
  dim: number;
};

export type EngineOptions = {
  count: number;
  dpr: number;
  /** Render only on change - for reduced motion */
  staticMode?: boolean;
  onFallback?: () => void;
};

const GLYPHS = "0123456789!@#$%^&*+=?<>/{}[]~;:";
const ATLAS_COLS = 8;
const ATLAS_ROWS = 4;

const VERT = /* glsl */ `
precision highp float;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uGlyphPx;
uniform float uDpr;
uniform float uAspect;
uniform float uPointerForce;
uniform float uEnergy;
uniform float uAccentMix;
uniform float uDim;
uniform float uDrift;
uniform float uScale;
uniform float uCamZ;
uniform float uRipple;
uniform float uScanX;
uniform float uScanOn;
uniform vec2 uPointer;
uniform vec2 uTrail;
uniform vec2 uRippleAt;
uniform vec3 uOffset;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uSpark;
uniform vec3 uAccent;
uniform mat4 uProj;
uniform mat4 uModel;
varying vec3 vColor;
varying float vAlpha;
varying float vGlyph;
varying float vFade;
varying vec2 vCell;

const float COLS = ${ATLAS_COLS}.0;
const float COUNT = ${GLYPHS.length}.0;

void main() {
  float e = clamp(uProgress * 1.4 - aSeed * 0.4, 0.0, 1.0);
  e = e * e * (3.0 - 2.0 * e);
  vec3 p = mix(aFrom, aTo, e);
  float flight = sin(e * 3.14159265);
  p += normalize(p + vec3(0.0001)) * flight * (0.22 + aSeed * 0.4);

  // Living motion: individual drift, a breathing shimmer and a slow travelling wave
  float t = uTime * (0.35 + aSeed * 0.3);
  p += vec3(sin(t + aSeed * 61.0), cos(t * 0.9 + aSeed * 17.0), sin(t * 0.8 + aSeed * 37.0)) * uDrift * (0.5 + aSeed);
  p *= 1.0 + uDrift * 0.9 * sin(uTime * 0.9 + aSeed * 6.2831);
  p.y += uDrift * 1.6 * sin(uTime * 1.1 + p.x * 2.4);

  vec4 world = uModel * vec4(p * uScale, 1.0);
  world.xyz += uOffset;
  vec4 view = world;
  view.z -= uCamZ;
  vec4 clip = uProj * view;
  vec2 ndc = clip.xy / clip.w;
  vec2 asp = vec2(uAspect, 1.0);

  // Distance to the cursor's comet (segment from the lagging trail to the pointer)
  vec2 pa = (ndc - uTrail) * asp;
  vec2 ba = (uPointer - uTrail) * asp;
  float hseg = clamp(dot(pa, ba) / max(dot(ba, ba), 0.00001), 0.0, 1.0);
  float dSeg = length(pa - ba * hseg);
  float dPtr = length((ndc - uPointer) * asp);

  float radius = 0.17 + 0.15 * uEnergy;
  float gPointer = smoothstep(radius, radius * 0.25, dSeg) * uPointerForce;
  // Wider "bubble" halo: dots swell and brighten before they turn into glyphs
  float halo = smoothstep(radius * 2.0, radius * 0.5, dSeg) * uPointerForce;

  // Click / tap shockwave
  float ring = uRipple * 1.35;
  float dRip = length((ndc - uRippleAt) * asp);
  float gRipple = smoothstep(0.14, 0.0, abs(dRip - ring)) * step(0.001, uRipple) * clamp(1.0 - uRipple / 1.5, 0.0, 1.0);

  // Ambient decoding scan line
  float gScan = uScanOn * smoothstep(0.045, 0.0, abs(ndc.x - uScanX)) * step(0.5, fract(aSeed * 3.7));

  float glyph = clamp(max(max(gPointer, gRipple), gScan), 0.0, 1.0);
  float eligible = step(0.32, fract(aSeed * 13.7));
  vGlyph = glyph * eligible;
  vFade = glyph * (1.0 - eligible);

  // Gentle push so the glyph bubble breathes around the cursor
  float push = smoothstep(0.34, 0.0, dPtr) * uPointerForce;
  ndc += ((ndc - uPointer) * asp / max(dPtr, 0.0001)) * vec2(1.0 / uAspect, 1.0) * push * (0.05 + 0.05 * uEnergy);
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  // Cycle through characters, faster when the cursor moves quickly
  float speed = 4.0 + 18.0 * uEnergy + 10.0 * gRipple;
  float idx = floor(mod(aSeed * 311.0 + uTime * speed * (0.55 + aSeed), COUNT));
  vCell = vec2(mod(idx, COLS), floor(idx / COLS));

  float depth = -view.z;
  float spark = step(0.986, aSeed);
  float dotSize = uSize * uDpr * (0.7 + aSeed * 0.7 + spark * 0.9) * (uCamZ / depth) * (1.0 + 1.3 * halo + 0.8 * gRipple);
  float glyphSize = uGlyphPx * uDpr * (0.8 + aSeed * 0.6) * (1.0 + 0.25 * uEnergy);
  gl_PointSize = mix(dotSize, glyphSize, vGlyph);

  float h = smoothstep(-1.5, 1.5, p.y + (aSeed - 0.5) * 0.9);
  vec3 base = mix(uColorA, uColorB, h);
  base = mix(base, uAccent, uAccentMix * (0.3 + 0.7 * aSeed));
  base = mix(base, uSpark, spark);
  base *= 1.0 + 1.1 * halo + 2.2 * gRipple;
  vec3 hot = fract(aSeed * 5.3) > 0.72 ? mix(uSpark, uAccent, uAccentMix) : vec3(0.95, 0.97, 1.0);
  vColor = mix(base, hot * 1.35, vGlyph);

  float fog = clamp(1.3 - (depth - (uCamZ - 1.4)) * 0.3, 0.3, 1.0);
  vAlpha = max(fog * uDim * (0.9 + 0.3 * spark + 0.3 * aSeed), vGlyph * (0.75 + 0.25 * uDim));
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uCellSize;
varying vec3 vColor;
varying float vAlpha;
varying float vGlyph;
varying float vFade;
varying vec2 vCell;
void main() {
  vec2 pc = gl_PointCoord;
  float d = length(pc - 0.5);
  float dotA = d > 0.5 ? 0.0 : pow(smoothstep(0.5, 0.0, d), 1.7);
  float glyphA = 0.0;
  if (vGlyph > 0.01) {
    glyphA = texture2D(uAtlas, (vCell + pc) * uCellSize).a;
  }
  float a = mix(dotA * (1.0 - vFade * 0.85), glyphA, vGlyph) * vAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vColor * a, 1.0);
}
`;

/** Renders the glyph set into an 8 x 4 texture atlas (512 x 256). */
function createGlyphAtlas(): HTMLCanvasElement {
  const cell = 64;
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_COLS * cell;
  canvas.height = ATLAS_ROWS * cell;
  const g = canvas.getContext("2d");
  if (!g) return canvas;
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "700 46px ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, Menlo, monospace";
  Array.from(GLYPHS).forEach((ch, i) => {
    const x = (i % ATLAS_COLS) * cell + cell / 2;
    const y = Math.floor(i / ATLAS_COLS) * cell + cell / 2 + 2;
    g.fillText(ch, x, y);
  });
  return canvas;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const v = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255) as [number, number, number];
};

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function rotationYX(y: number, x: number) {
  const cy = Math.cos(y), sy = Math.sin(y), cx = Math.cos(x), sx = Math.sin(x);
  // Ry * Rx (column-major)
  // prettier-ignore
  return new Float32Array([
    cy, 0, -sy, 0,
    sy * sx, cx, cy * sx, 0,
    sy * cx, -sx, cy * cx, 0,
    0, 0, 0, 1,
  ]);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class ParticleEngine {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private fromBuffer: WebGLBuffer;
  private toBuffer: WebGLBuffer;
  private from: Float32Array;
  private to: Float32Array;
  private seeds: Float32Array;
  private count: number;
  private drawCount: number;
  private dpr: number;
  private staticMode: boolean;

  private progress = 1;
  private morphStart = 0;
  private morphDuration = 1700;
  private formation: FormationName | null = null;

  private stage: Stage = { x: 0, y: 0, scale: 1, dim: 1 };
  private stageTarget: Stage = { x: 0, y: 0, scale: 1, dim: 1 };
  private accent: [number, number, number] = [1, 0.69, 0.13];
  private accentTarget: [number, number, number] = [1, 0.69, 0.13];
  private accentMix = 0;
  private accentMixTarget = 0;

  private pointer = { x: 0, y: 0, tx: 0, ty: 0, force: 0, forceTarget: 0, active: false };
  private trail = { x: 0, y: 0 };
  private energy = 0;
  private lastMove = 0;
  private lastTarget = { x: 0, y: 0 };
  private ripple = { x: 0, y: 0, start: -10 };
  private atlas: WebGLTexture;
  private raf = 0;
  private running = false;
  private startTime = performance.now();
  private lastFrame = 0;
  private slowFrames = 0;
  private sampled = 0;
  private width = 1;
  private height = 1;
  private disposed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    options: EngineOptions,
  ) {
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.count = options.count;
    this.drawCount = options.count;
    this.dpr = options.dpr;
    this.staticMode = Boolean(options.staticMode);

    this.program = this.createProgram();
    gl.useProgram(this.program);

    for (const name of [
      "uProgress", "uTime", "uSize", "uGlyphPx", "uDpr", "uAspect", "uPointerForce", "uEnergy", "uAccentMix",
      "uDim", "uDrift", "uScale", "uCamZ", "uRipple", "uScanX", "uScanOn", "uPointer", "uTrail", "uRippleAt",
      "uOffset", "uColorA", "uColorB", "uSpark", "uAccent", "uProj", "uModel", "uAtlas", "uCellSize",
    ]) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }

    this.from = new Float32Array(this.count * 3);
    this.to = new Float32Array(this.count * 3);
    this.seeds = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      // golden-ratio sequence: evenly spread, stable seeds
      this.seeds[i] = (i * 0.6180339887) % 1;
    }

    this.fromBuffer = this.createAttribute("aFrom", this.from, 3, gl.DYNAMIC_DRAW);
    this.toBuffer = this.createAttribute("aTo", this.to, 3, gl.DYNAMIC_DRAW);
    this.createAttribute("aSeed", this.seeds, 1, gl.STATIC_DRAW);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(4 / 255, 5 / 255, 10 / 255, 1);

    gl.uniform3fv(this.uniforms.uColorA, [0.42, 0.48, 1.0]);
    gl.uniform3fv(this.uniforms.uColorB, [0.92, 0.94, 1.0]);
    gl.uniform3fv(this.uniforms.uSpark, [1, 0.72, 0.22]);
    gl.uniform1f(this.uniforms.uCamZ, 4.6);

    // Glyph atlas for the cursor "decode" effect
    this.atlas = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.atlas);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createGlyphAtlas());
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(this.uniforms.uAtlas, 0);
    gl.uniform2f(this.uniforms.uCellSize, 1 / ATLAS_COLS, 1 / ATLAS_ROWS);

    canvas.addEventListener("webglcontextlost", this.onContextLost, false);
    this.onFallback = options.onFallback;
    this.resize();
  }

  private onFallback?: () => void;

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.stop();
    this.onFallback?.();
  };

  private createShader(type: number, source: string) {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile failed: ${info}`);
    }
    return shader;
  }

  private createProgram() {
    const gl = this.gl;
    const program = gl.createProgram()!;
    gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
    }
    return program;
  }

  private createAttribute(name: string, data: Float32Array, size: number, usage: number) {
    const gl = this.gl;
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    const loc = gl.getAttribLocation(this.program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    return buffer;
  }

  /** Where each particle is right now (mirrors the vertex shader morph). */
  private snapshot() {
    const e0 = this.progress;
    const out = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      const seed = this.seeds[i];
      let e = Math.min(1, Math.max(0, e0 * 1.4 - seed * 0.4));
      e = e * e * (3 - 2 * e);
      const flight = Math.sin(e * Math.PI) * (0.22 + seed * 0.4);
      const k = i * 3;
      const x = lerp(this.from[k], this.to[k], e);
      const y = lerp(this.from[k + 1], this.to[k + 1], e);
      const z = lerp(this.from[k + 2], this.to[k + 2], e);
      const len = Math.hypot(x, y, z) || 1;
      out[k] = x + (x / len) * flight;
      out[k + 1] = y + (y / len) * flight;
      out[k + 2] = z + (z / len) * flight;
    }
    return out;
  }

  setFormation(name: FormationName, { instant = false } = {}) {
    if (name === this.formation || this.disposed) return;
    const target = buildFormation(name, this.count);
    const gl = this.gl;

    if (this.formation === null || instant || this.staticMode) {
      this.from = target;
      this.to = target;
      this.progress = 1;
    } else {
      this.from = this.progress >= 1 ? this.to : this.snapshot();
      this.to = target;
      this.progress = 0;
      this.morphStart = performance.now();
    }
    this.formation = name;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.fromBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.from, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.toBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.to, gl.DYNAMIC_DRAW);
    this.invalidate();
  }

  setStage(stage: Partial<Stage>, { instant = false } = {}) {
    this.stageTarget = { ...this.stageTarget, ...stage };
    if (instant || this.staticMode) this.stage = { ...this.stageTarget };
    this.invalidate();
  }

  setAccent(hex: string | null) {
    if (hex) {
      this.accentTarget = hexToRgb(hex);
      this.accentMixTarget = 0.62;
    } else {
      this.accentMixTarget = 0;
    }
    if (this.staticMode) {
      this.accent = this.accentTarget;
      this.accentMix = this.accentMixTarget;
    }
    this.invalidate();
  }

  /** Pointer in normalised device coordinates (-1..1). */
  setPointer(x: number, y: number, active = true) {
    const p = this.pointer;
    if (active && !p.active) {
      // entering: snap the trail so the comet doesn't streak across the screen
      this.trail.x = x;
      this.trail.y = y;
      p.x = x;
      p.y = y;
    }
    p.tx = x;
    p.ty = y;
    p.active = active;
    p.forceTarget = active ? 1 : 0;
    if (active) this.lastMove = performance.now();
  }

  /** Shockwave of glyphs from a click or tap (NDC). */
  pulse(x: number, y: number) {
    if (this.staticMode) return;
    this.ripple = { x, y, start: performance.now() };
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.invalidate();
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** In static mode, draw once after any change. */
  private invalidate() {
    if (this.staticMode && !this.disposed) {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => this.render(0));
    }
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(64, now - this.lastFrame);
    this.lastFrame = now;
    this.adapt(dt);
    this.render(dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  /** Drop resolution, then particle count, if the device is struggling. */
  private adapt(dt: number) {
    if (this.sampled > 240) return;
    this.sampled++;
    if (this.sampled < 30) return;
    if (dt > 26) this.slowFrames++;
    if (this.slowFrames > 40) {
      this.slowFrames = 0;
      if (this.dpr > 1) {
        this.dpr = 1;
        this.resize();
      } else if (this.drawCount === this.count) {
        this.drawCount = Math.floor(this.count * 0.72);
      }
    }
  }

  private render(dt: number) {
    const gl = this.gl;
    const now = performance.now();
    const time = this.staticMode ? 0 : (now - this.startTime) / 1000;
    const k = this.staticMode ? 1 : 1 - Math.pow(0.001, dt / 1000); // frame-rate independent smoothing

    if (this.progress < 1 && !this.staticMode) {
      this.progress = Math.min(1, (now - this.morphStart) / this.morphDuration);
    }

    const s = this.stage;
    const st = this.stageTarget;
    const sk = Math.min(1, k * 0.9);
    s.x = lerp(s.x, st.x, sk);
    s.y = lerp(s.y, st.y, sk);
    s.scale = lerp(s.scale, st.scale, sk);
    s.dim = lerp(s.dim, st.dim, sk);

    this.accentMix = lerp(this.accentMix, this.accentMixTarget, k);
    this.accent = this.accent.map((c, i) => lerp(c, this.accentTarget[i], k)) as [number, number, number];

    const p = this.pointer;
    const pk = this.staticMode ? 1 : Math.min(1, k * 1.6);
    p.x = lerp(p.x, p.tx, pk);
    p.y = lerp(p.y, p.ty, pk);
    // Calm down when the cursor rests; wake up again when it moves
    const idle = p.active && now - this.lastMove > 2600;
    p.force = lerp(p.force, idle ? 0.7 : p.forceTarget, Math.min(1, k * 0.8));

    const moved = Math.hypot(p.tx - this.lastTarget.x, p.ty - this.lastTarget.y);
    this.lastTarget = { x: p.tx, y: p.ty };
    const energyTarget = dt > 0 ? Math.min(1, (moved / dt) * 38) : 0;
    this.energy = lerp(this.energy, energyTarget, energyTarget > this.energy ? Math.min(1, k * 2.4) : Math.min(1, k * 0.35));

    const tk = Math.min(1, k * 0.28);
    this.trail.x = lerp(this.trail.x, p.x, tk);
    this.trail.y = lerp(this.trail.y, p.y, tk);

    const rippleAge = (now - this.ripple.start) / 1000;
    // An ambient decoding line sweeps across every 7 seconds
    const scanPhase = ((time % 7) / 2.4);
    const scanOn = !this.staticMode && scanPhase < 1 ? Math.sin(scanPhase * Math.PI) : 0;

    const aspect = this.width / this.height;
    const u = this.uniforms;
    gl.uniform1f(u.uProgress, this.progress);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uSize, this.width < 768 ? 4.2 : 4.0);
    gl.uniform1f(u.uGlyphPx, this.width < 768 ? 15 : 18);
    gl.uniform1f(u.uEnergy, this.staticMode ? 0 : this.energy);
    gl.uniform2f(u.uTrail, this.trail.x, this.trail.y);
    gl.uniform1f(u.uRipple, !this.staticMode && rippleAge < 1.5 ? rippleAge : 0);
    gl.uniform2f(u.uRippleAt, this.ripple.x, this.ripple.y);
    gl.uniform1f(u.uScanX, -1.15 + Math.min(scanPhase, 1) * 2.3);
    gl.uniform1f(u.uScanOn, scanOn * 0.85);
    gl.uniform1f(u.uDpr, this.dpr);
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform1f(u.uPointerForce, this.staticMode ? 0 : p.force);
    gl.uniform1f(u.uAccentMix, this.accentMix);
    gl.uniform1f(u.uDim, s.dim);
    gl.uniform1f(u.uDrift, this.staticMode ? 0 : 0.026);
    gl.uniform1f(u.uScale, s.scale);
    gl.uniform2f(u.uPointer, p.x, p.y);
    gl.uniform3f(u.uOffset, s.x, s.y, 0);
    gl.uniform3fv(u.uAccent, this.accent);
    // Narrow screens get a wider field of view so formations fit
    const fov = aspect < 1 ? 0.95 : 0.63;
    gl.uniformMatrix4fv(u.uProj, false, perspective(fov, aspect, 0.1, 50));
    // Oscillate rather than spin, so flat formations (the mark, rings) never turn edge-on
    const spin = this.staticMode ? 0.35 : Math.sin(time * 0.16) * 0.62 + Math.sin(time * 0.41) * 0.08;
    gl.uniformMatrix4fv(u.uModel, false, rotationYX(spin + p.x * 0.28, 0.12 - p.y * 0.18));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, this.drawCount);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    const gl = this.gl;
    gl.deleteBuffer(this.fromBuffer);
    gl.deleteBuffer(this.toBuffer);
    gl.deleteTexture(this.atlas);
    gl.deleteProgram(this.program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
