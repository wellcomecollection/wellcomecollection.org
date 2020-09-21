// @flow
// We add 2048 as Wordpresses image service only supports image resizing up till then
// TODO We no longer use Wordpresses image service so should probably revisit this
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
