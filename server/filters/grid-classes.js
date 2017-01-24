export default function gridClasses(sizes = {}) {
  const base = 'grid__cell';
  const t = Object.keys(sizes).map(key => {
    const size = sizes[key];
    const modifier = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `${base}--${modifier}${size}`;
  });

  return [base].concat(t).join(' ');
}
