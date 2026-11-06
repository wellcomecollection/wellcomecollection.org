/**
 * The height (as a % of its box, from the top) of a wobbly edge's
 * clip-path polygon at a given horizontal position (as a %).
 * The points run left to right along the edge, e.g.
 * `polygon(0% 100%, 20% 64%, 41% 80%, 100% 100%)`.
 */
export function polygonTopAt(
  clipPath: string,
  xPercent: number
): number | undefined {
  const points = [...clipPath.matchAll(/(-?[\d.]+)%\s+(-?[\d.]+)%/g)].map(
    ([, x, y]) => ({ x: Number(x), y: Number(y) })
  );

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (xPercent >= a.x && xPercent <= b.x && b.x > a.x) {
      return a.y + ((b.y - a.y) * (xPercent - a.x)) / (b.x - a.x);
    }
  }

  return undefined;
}

/**
 * A hard-stop linear-gradient (angle and stop position) whose stop runs
 * along a straight line across a box, from `leftY` on its left edge to
 * `rightY` on its right (both from the box's top). Everything above the
 * line takes the gradient's first colour.
 */
export function splitGradient({
  width,
  height,
  leftY,
  rightY,
}: {
  width: number;
  height: number;
  leftY: number;
  rightY: number;
}): { angle: number; stop: number } {
  // Unit vector at right angles to the line, pointing down past it
  const length = Math.hypot(width, rightY - leftY) || 1;
  const nx = -(rightY - leftY) / length;
  const ny = width / length;

  // CSS angles run clockwise from "to top"
  const angle = ((Math.atan2(nx, -ny) * 180) / Math.PI + 360) % 360;
  const gradientLength = Math.abs(width * nx) + Math.abs(height * ny);
  const stop = ny * ((leftY + rightY) / 2 - height / 2) + gradientLength / 2;

  return { angle, stop };
}
