const colors = {
  'seaweed': ['#034e44', 'primary'],
  'mint': ['#0aa38f', 'primary'],
  'elf-green': ['#088574', 'primary'],
  'white': ['#ffffff', 'primary'],
  'cream': ['#f0ede3', 'primary'],
  'black': ['#1d1d1d', 'primary'],
  'dark-black': ['#010101', 'primary'],
  'turquoise-graphics': ['#5cb8bf', 'secondary'],
  'turquoise-text': ['#367378', 'secondary'],
  'teal': ['#006272', 'secondary'],
  'petrol': ['#00424d', 'secondary'],
  'purple-graphics': ['#b67bc2', 'secondary'],
  'purple-text': ['#895791', 'secondary'],
  'indigo': ['#46284d', 'secondary'],
  'red-graphics': ['#ff4355', 'secondary'],
  'red-text': ['#c72e3d', 'secondary'],
  'orange-graphics': ['#e87500', 'secondary'],
  'orange-text': ['#ad4e00', 'secondary'],
  'yellow': ['#ffce3c', 'secondary'],
  'pewter': ['#717171', 'secondary'],
  'silver': ['#8f8f8f', 'secondary'],
  'smoke': ['#e8e8e8', 'secondary'],
  'pumice': ['#d9d6ce', 'secondary'],
  'charcoal': ['#323232', 'secondary'],
  'java': ['#1fbea9', 'secondary'],
  'cotton-seed': ['#bcbab5', 'secondary'],
  'transparent': ['transparent', 'tertiary'],
  'transparent-black': ['rgba(29, 29, 29, 0.61)', 'tertiary'],
  // Opacity value explanation; We use transparent to provide a background to white text which overlays a variety of images (therefore unknown colour contrast).  This opacity is the lightest we can go, while still providing sufficient contrast to pass WCAG guidlines, when it is displayed above a white background, i.e. worst case scenario.
  'inherit': ['inherit', 'tertiary'],
  'currentColor': ['currentColor', 'tertiary']
};

// We have to add additional quotes in order to have single-quoted
// key names in the ultimate scss output.
function extraQuoteKey(key) {
  return `'${key}'`;
}

const extraQuotedColors = Object.assign(
  {},
  ...Object.keys(colors)
    .map(key => ({[extraQuoteKey(key)]: colors[key]}))
);

module.exports = extraQuotedColors;
