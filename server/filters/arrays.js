// @flow
// This is a way of doing this, having find in the templates would be much better (JSX?)
export function findObjInArray<T>(arr: Array<T>, key: string, val: string): ?T {
  return arr.find(obj => obj[key] === val);
}
