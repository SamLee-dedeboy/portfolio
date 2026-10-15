// Shared thread geometry — used by the margin thread (FourStitches) and the
// letter's sewing thread (DeepestFear) so every knot on the site is tied the
// same way.

/** Deterministic 0..1 noise so hand-drawn variation is stable across renders. */
export const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * A knot: a prolate trochoid, the curve a pen traces when it draws a loop.
 * `r` sets the vertical pace, `d` the loop's reach; d > r makes it cross
 * itself. Every loop gets its own character (size, lobe fullness, squash),
 * but it always enters at (cx, Yc − rπ) moving down and exits at (cx, Yc + rπ)
 * so the straight thread flows through it without a kink.
 */
export function knotPoints(
  Yc: number,
  seed: number,
  cx: number,
  baseR: number,
  baseD: number,
  samples = 44,
): { x: number; y: number }[] {
  const r = baseR * (0.9 + 0.2 * rnd(seed));
  const d = baseD * (0.82 + 0.36 * rnd(seed + 1));
  const lobe = (rnd(seed + 2) - 0.5) * 0.5;
  const squash = 0.85 + 0.3 * rnd(seed + 3);
  const pts: { x: number; y: number }[] = [];
  for (let k = 0; k <= samples; k++) {
    const t = -Math.PI + (2 * Math.PI * k) / samples;
    pts.push({
      x: cx + d * (Math.cos(t) + 1) * (1 + lobe * Math.sin(t)),
      y: Yc + r * t - d * squash * Math.sin(t),
    });
  }
  return pts;
}

/** A straight run with a faint, smooth lateral drift — hand-held, not ruled. */
export function runPath(y0: number, y1: number, seed: number, cx: number): string {
  const f = (n: number) => n.toFixed(2);
  const len = y1 - y0;
  if (len < 24) return ` L ${f(cx)} ${f(y1)}`;
  const a = (rnd(seed) - 0.5) * 2.4;
  const b = (rnd(seed + 1) - 0.5) * 2.4;
  return ` C ${f(cx + a)} ${f(y0 + len * 0.33)} ${f(cx + b)} ${f(y0 + len * 0.66)} ${f(cx)} ${f(y1)}`;
}
