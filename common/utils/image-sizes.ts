// We chose 2048 for the maxWidth as we used the Wordpress image service which only supported image resizing up till then.
// This could be updated in the future, but as there are no current complaints regarding quality levels, we're keeping as is for now.
const maxWidth = 2048;
export const supportedSizes = [
  160,
  180,
  282,
  320,
  420,
  600,
  880,
  960,
  1024,
  1338,
  maxWidth,
];

export function imageSizes(width: number): number[] {
  return supportedSizes
    .concat([width])
    .filter(size => size <= width && size <= maxWidth);
}
