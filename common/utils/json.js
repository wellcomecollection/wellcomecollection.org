// @flow
export function removeEmptyProps(obj: Object): Object {
  return JSON.parse(
    JSON.stringify(obj, function(key, value) {
      return value === null || value === undefined ? undefined : value;
    })
  );
}
