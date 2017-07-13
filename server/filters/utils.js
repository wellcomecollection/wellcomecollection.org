export function getSizesAsObject(sizes) {
  if (typeof sizes === 'object') {
    return sizes;
  }

  return {s: sizes, m: sizes, l: sizes};
}
