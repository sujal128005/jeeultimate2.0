/**
 * No-WebGL fallback: a still, dotted orb built from CSS and SVG so the page
 * keeps its atmosphere on any device.
 */
export function StaticField() {
  const dots = Array.from({ length: 220 }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / 220;
    const r = Math.sqrt(1 - y * y);
    const phi = i * 2.39996;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    return { cx: 50 + x * 34, cy: 50 + y * 34, o: 0.25 + (z + 1) * 0.35, s: 0.35 + (z + 1) * 0.25 };
  });
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,rgb(64_76_168/0.35),transparent_60%)]" />
      <svg viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 w-[min(90vw,780px)] -translate-x-1/2 -translate-y-1/2 lg:left-[68%]">
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.s} fill={i % 29 === 0 ? "#ffb020" : "#c8cff2"} opacity={d.o} />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgb(4_5_10/0.8)_100%)]" />
    </div>
  );
}
