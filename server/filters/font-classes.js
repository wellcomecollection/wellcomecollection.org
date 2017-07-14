export default function fontClasses(sizes) {
  return Object.keys(sizes).map(key => {
    return `font-${sizes[key]}-${key}`;
  }).join(' ');
}
