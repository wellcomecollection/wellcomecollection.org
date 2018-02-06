const colors = {
  'white': '#ffffff',
  'black': '#010101',
  'purple': '#944aa0',
  'teal': '#006272',
  'cyan': '#298187',
  'turquoise': '#5cb8bf',
  'red': '#e01b2f',
  'orange': '#e87500',
  'yellow': '#ffce3c',
  'brown': '#815e48',
  'cream': '#f0ede3',
  'green': '#088574',
  'charcoal': '#323232',
  'pewter': '#717171',
  'silver': '#8f8f8f',
  'marble': '#bcbab5',
  'pumice': '#d9d6ce',
  'smoke': '#e8e8e8',
  'transparent': 'transparent',
  'transparent-black': 'rgba(29, 29, 29, 0.61)',
  // Opacity value explanation; We use transparent to provide a background to white text which overlays a variety of images (therefore unknown colour contrast).  This opacity is the lightest we can go, while still providing sufficient contrast to pass WCAG guidlines, when it is displayed above a white background, i.e. worst case scenario.
  'inherit': 'inherit',
  'currentColor': 'currentColor'
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
