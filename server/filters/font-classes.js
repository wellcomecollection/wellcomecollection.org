import { getSizesAsObject } from './utils';

export default function fontClasses(sizes) {
  const sizesObject = getSizesAsObject(sizes);

  return Object.keys(sizesObject).map(key => {
    return `font-${sizesObject[key]}-${key}`;
  }).join(' ');
}
