import { buildFormation, type FormationName } from "./formations";

/**
 * A small, dependency-free WebGL particle engine.
 * - One draw call (gl.POINTS), additive blending
 * - Morphs happen on the GPU: two position buffers + a progress uniform
 * - Pointer repulsion in screen space, gentle drift, slow rotation
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

const VERT = /* glsl */ `
precision highp float;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uDpr;
uniform float uAspect;
uniform float uPointerForce;
uniform float uAccentMix;
uniform float uDim;
uniform float uDrift;
uniform float uScale;
uniform float uCamZ;
uniform vec2 uPointer;
uniform vec3 uOffset;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uSpark;
uniform vec3 uAccent;
uniform mat4 uProj;
uniform mat4 uModel;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float e = clamp(uProgress * 1.4 - aSeed * 0.4, 0.0, 1.0);
  e = e * e * (3.0 - 2.0 * e);
  vec3 p = mix(aFrom, aTo, e);
  float flight = sin(e * 3.14159265);
  p += normalize(p + vec3(0.0001)) * flight * (0.22 + aSeed * 0.4);

  float t = uTime * (0.35 + aSeed * 0.3);
  p += vec3(sin(t + aSeed * 61.0), cos(t * 0.9 + aSeed * 17.0), sin(t * 0.8 + aSeed * 37.0)) * uDrift * (0.5 + aSeed);

  vec4 world = uModel * vec4(p * uScale, 1.0);
  world.xyz += uOffset;
  vec4 view = world;
  view.z -= uCamZ;
  vec4 clip = uProj * view;

  vec2 ndc = clip.xy / clip.w;
  vec2 d = (ndc - uPointer) * vec2(uAspect, 1.0);
  float dist = length(d);
  float push = smoothstep(0.42, 0.0, dist) * uPointerForce;
  ndc += (d / max(dist, 0.0001)) * vec2(1.0 / uAspect, 1.0) * push * 0.11;
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  float depth = -view.z;
  float spark = step(0.986, aSeed);
  gl_PointSize = uSize * uDpr * (0.7 + aSeed * 0.7 + spark * 0.9) * (uCamZ / depth);

  float h = smoothstep(-1.5, 1.5, p.y + (aSeed - 0.5) * 0.9);
  vec3 base = mix(uColorA, uColorB, h);
  base = mix(base, uAccent, uAccentMix * (0.3 + 0.7 * aSeed));
  vColor = mix(base, uSpark, spark) * (1.0 + push * 1.6);
  float fog = clamp(1.3 - (depth - (uCamZ - 1.4)) * 0.3, 0.3, 1.0);
  vAlpha = fog * uDim * (0.9 + 0.3 * spark + 0.3 * aSeed);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  float a = pow(core, 1.7) * vAlpha;
  gl_FragColor = vec4(vColor * a, 1.0);
}
`;

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

  private pointer = { x: 0, y: 0, tx: 0, ty: 0, force: 0, forceTarget: 0 };
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
      "uProgress", "uTime", "uSize", "uDpr", "uAspect", "uPointerForce", "uAccentMix", "uDim", "uDrift",
      "uScale", "uCamZ", "uPointer", "uOffset", "uColorA", "uColorB", "uSpark", "uAccent", "uProj", "uModel",
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
    this.pointer.tx = x;
    this.pointer.ty = y;
    this.pointer.forceTarget = active ? 1 : 0;
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
    p.force = lerp(p.force, p.forceTarget, k);

    const aspect = this.width / this.height;
    const u = this.uniforms;
    gl.uniform1f(u.uProgress, this.progress);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uSize, this.width < 768 ? 4.2 : 4.0);
    gl.uniform1f(u.uDpr, this.dpr);
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform1f(u.uPointerForce, this.staticMode ? 0 : p.force);
    gl.uniform1f(u.uAccentMix, this.accentMix);
    gl.uniform1f(u.uDim, s.dim);
    gl.uniform1f(u.uDrift, this.staticMode ? 0 : 0.018);
    gl.uniform1f(u.uScale, s.scale);
    gl.uniform2f(u.uPointer, p.x, p.y);
    gl.uniform3f(u.uOffset, s.x, s.y, 0);
    gl.uniform3fv(u.uAccent, this.accent);
    // Narrow screens get a wider field of view so formations fit
    const fov = aspect < 1 ? 0.95 : 0.63;
    gl.uniformMatrix4fv(u.uProj, false, perspective(fov, aspect, 0.1, 50));
    // Oscillate rather than spin, so flat formations (the mark, rings) never turn edge-on
    const spin = this.staticMode ? 0.35 : Math.sin(time * 0.16) * 0.55;
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
    gl.deleteProgram(this.program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
