// @flow
import { css, keyframes } from 'styled-components';

// When units are `number`s, we assume pixels
const theme = {
  spacingUnit: 6,
  borderRadiusUnit: 6,
  sizes: {
    small: 0,
    medium: 600,
    large: 960,
    xlarge: 1338,
  },
  colors: {
    white: '#ffffff',
    black: '#010101',
    purple: '#944aa0',
    teal: '#006272',
    cyan: '#298187',
    turquoise: '#5cb8bf',
    red: '#e01b2f',
    orange: '#e87500',
    yellow: '#ffce3c',
    brown: '#815e48',
    cream: '#f0ede3',
    green: '#007868',
    charcoal: '#323232',
    pewter: '#717171',
    silver: '#8f8f8f',
    marble: '#bcbab5',
    pumice: '#d9d6ce',
    smoke: '#e8e8e8',
    // The following 'black' is only to be used for the item viewer
    coal: '#1f1f1f',
    //
    transparent: 'transparent',
    'transparent-black': 'rgba(29, 29, 29, 0.61)',
    // Opacity value explanation; We use transparent to provide a background to white text which overlays a variety of images (therefore unknown colour contrast).  This opacity is the lightest we can go, while still providing sufficient contrast to pass WCAG guidlines, when it is displayed above a white background, i.e. worst case scenario.
    inherit: 'inherit',
    currentColor: 'currentColor',
  },
  keyframes: {
    hoverBounce: keyframes`
      0% {
        top: 0;
        animation-timing-function: ease-in;
      }

      50% {
        top: -0.4em;
        animation-timing-function: ease-out;
      }

      100% {
        top: 0;
      }
      `,
  },
};

// https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md#media-templates
// using min-width because of
// https://zellwk.com/blog/how-to-write-mobile-first-css/
const media = Object.keys(theme.sizes).reduce((acc, label) => {
  const emSize = theme.sizes[label] / 16;
  acc[label] = (...args: any) => css`
    @media (min-width: ${emSize}em) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});

export default {
  ...theme,
  media,
};
