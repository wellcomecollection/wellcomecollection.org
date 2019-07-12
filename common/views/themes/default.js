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
  spaceAtBreakpoints: {
    small: {
      xs: 4,
      s: 6,
      m: 8,
      l: 16,
      xl: 30,
    },
    medium: {
      xs: 4,
      s: 6,
      m: 12,
      l: 24,
      xl: 46,
    },
    large: {
      xs: 4,
      s: 8,
      m: 16,
      l: 32,
      xl: 64,
    },
  },
};

type SpaceSizes = 'xs' | 's' | 'm' | 'l' | 'xl';
type SpaceProperty =
  | 'margin-bottom'
  | 'margin-top'
  | 'padding-bottom'
  | 'padding-top'
  | 'top'
  | 'bottom';

function makeSpacePropertyValues(
  size: SpaceSizes,
  properties: SpaceProperty[] = ['margin-bottom'],
  negative: ?boolean
): string {
  return ['small', 'medium', 'large']
    .map(bp => {
      return `@media (min-width: ${theme.sizes[bp]}px) {
      ${properties
        .map(
          p =>
            `${p}: ${negative ? '-' : ''}${
              theme.spaceAtBreakpoints[bp][size]
            }px;`
        )
        .join('')}
    }`;
    })
    .join('');
}

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
  makeSpacePropertyValues,
};
