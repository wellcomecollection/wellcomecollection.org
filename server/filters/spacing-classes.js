import { getSizesAsObject } from './utils';

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
