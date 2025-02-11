export const clamp = (x: number, min = 0, max = 1): number =>
  x > max ? max : x < min ? min : x;

export function simplifyCount(number: number) {
  return number >= 1000 ? parseFloat((number / 1000).toFixed(1)) + 'K' : number;
}
