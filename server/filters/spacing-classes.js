export default function spacingClasses(sizes, type, direction) {
  return Object.keys(sizes).map(key => {
    const size = sizes[key];
    return `${type}-${direction}-${key}${size}`;
  }).join(' ');
}
