export const clamp = (x: number, min = 0, max = 1): number =>
  x > max ? max : x < min ? min : x;
