export function isNotUndefined<T>(val: T | undefined): val is T {
  return typeof val !== 'undefined';
}
