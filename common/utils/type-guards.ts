export function isInTuple<T extends string>(
  val: string,
  tuple: readonly T[]
): val is T {
  return tuple.includes(val as T);
}
