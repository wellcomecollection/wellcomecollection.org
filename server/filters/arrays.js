// This is a way of doing this, having find in the templates would be much better (JSX?)
export function findObjInArray(arr, key, val) {
  return arr.find(obj => obj[key] === val);
}
