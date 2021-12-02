export function isNotUndefined<T>(val: T | undefined): val is T {
  return typeof val !== 'undefined';
}

export function isUndefined<T>(val: T | undefined): val is T {
  return typeof val === 'undefined';
}

export function isString(v: any): v is string {
  return typeof v === 'string';
}
