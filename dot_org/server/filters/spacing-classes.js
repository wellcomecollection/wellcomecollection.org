export default function spacingClasses(sizes, properties) {
  return Object.keys(sizes).map(key => {
    const size = sizes[key];

    return Object.keys(properties).map((property) => {
      const directions = properties[property];

      return directions.map((direction) => {
        return `${property}-${direction}-${key}${size}`;
      }).join(' ');
    }).join(' ');
  }).join(' ');
}
