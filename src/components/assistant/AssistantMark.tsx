/**
 * Saarthi's mark: a needle pointing the way, with the wheel it rides on.
 * It is the icon itself, not a glyph parked inside a circle, so the shape
 * reads on its own wherever it sits.
 */
export function AssistantMark({ className, id = "saarthi" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-body`} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ju-brand-300)" />
          <stop offset="0.52" stopColor="var(--ju-brand-500)" />
          <stop offset="1" stopColor="var(--ju-brand-700)" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.85" />
          <stop offset="1" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* The needle: a sail cut from a rounded square, open at the tail */}
      <path
        d="M24.9 3.2c1 -1.1 2.9 -0.4 2.9 1.1v15.4c0 0.7 0.5 1.3 1.2 1.4l14.2 2.6c1.5 0.3 1.8 2.3 0.5 3l-33.8 17.9c-1.5 0.8 -3.2 -0.8 -2.5 -2.4L24.9 3.2Z"
        fill={`url(#${id}-body)`}
      />
      {/* Lit edge, so the shape has a direction even at 20px */}
      <path
        d="M24.9 3.2c1 -1.1 2.9 -0.4 2.9 1.1v15.4c0 0.7 0.5 1.3 1.2 1.4l3.4 0.6 -7.5 -0.3Z"
        fill={`url(#${id}-edge)`}
      />
      {/* The wheel it steers: a single orbit dot */}
      <circle cx="10.5" cy="14.5" r="3.1" fill="var(--ju-brand-400)" />
    </svg>
  );
}
