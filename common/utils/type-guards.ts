// The functions in this file provide "type guards" -- a runtime check
// that guarantees the type is what we think it is.  This is a TypeScript
// feature called "narrowing".
//
// For more information, see https://www.typescriptlang.org/docs/handbook/2/narrowing.html
//
// == Example ==
//
// We have a value which has type `string | string[]`.  We want to print the
// original value if it's a raw string, or a comma-separated string if it's a list.
// We might write:
//
//    function printString(s: string | string[]) {
//      console.log(s.join(','));
//    }
//
// but TypeScript will complain because there is no `join` method on `string`.
//
// But if we use a type guard:
//
//    function printString(s: string | string[]) {
//      if (isString(s)) {
//        console.log(s);
//      } else {
//        console.log(s.join(','));
//      }
//    }
//
// then TypeScript is happy, because it knows the type is `string[]` in the
// second branch, and so the `join` method is definitely defined.

export function isInTuple<T extends string>(
  val: string,
  tuple: readonly T[]
): val is T {
  return tuple.includes(val as T);
}
