export function arrayFromObject(object) {
  return Object.keys(object)
    .map(key => {
      return object[key];
    });
}
