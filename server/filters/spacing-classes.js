import { getSizesAsObject } from './utils';
// In the main, we'd want to be able to write `{{ {s:2} | spacingClasses }}`
// and have all of the breakpoints populated with that size (i.e. equivalent
// to writing `{{ {s:2, m:2, l:2, xl:2} | spacingClasses }}`, but there are
// occasions when we only want to apply spacing classes at one or two
// breakpoints. This can be achieved by setting `fillIn` to `false`.
export default function spacingClasses(sizes, properties, fillIn = true) {
  const sizesObject = getSizesAsObject(sizes);
  const sizesToUse = fillIn ? sizesObject : sizes;

  return Object.keys(sizesToUse).map(key => {
    const size = sizesToUse[key];

    return Object.keys(properties).map((property) => {
      const directions = properties[property];

      return directions.map((direction) => {
        return `${property}-${direction}-${key}${size}`;
      }).join(' ');
    }).join(' ');
  }).join(' ');
}
