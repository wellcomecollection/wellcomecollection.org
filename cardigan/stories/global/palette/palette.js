import { storiesOf } from '@storybook/react';
import paletteReadme from './README.md';

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
  'green': '#007868',
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

const stories = storiesOf('Global', module);

const colorsArr = Object.keys(colors)
  .map(key => {
    const val = extraQuotedColors[key];
    return val.indexOf('#') > -1 && { // Don't display e.g. 'currentColor' or 'transparent'
      name: key.replace(/'/g, ''),
      hex: val
    };
  }).filter(Boolean);

const Palette = () => {
  return (
    <div className='styleguide__palette__section'>
      {colorsArr.map(color => (
        <div key={color.name} className='styleguide__palette__block'>
          <h2 className='styleguide__palette__name'>{color.name}</h2>
          <div className={`styleguide__palette__color styleguide__palette__color--${color.name}`} style={{background: color.hex}}></div>
          <span className='styleguide__palette__hex'>Hex: <code className='styleguide__palette__code'>{color.hex}</code></span>
        </div>
      ))}
    </div>
  );
};

stories
  .add('Palette', Palette, {info: paletteReadme});
