// @flow
import { css, keyframes } from 'styled-components';
import { type SpaceOverrides } from '../components/styled/Space';

const spacingUnits = {
  '1': 4,
  '2': 6,
  '3': 8,
  '4': 12,
  '5': 16,
  '6': 24,
  '7': 30,
  '8': 32,
  '9': 46,
  '10': 64,
};
// When units are `number`s, we assume pixels
const theme = {
  spacingUnit: 6,
  borderRadiusUnit: 6,
  transitionProperties: '150ms ease',
  sizes: {
    small: 0,
    medium: 600,
    large: 960,
    xlarge: 1338,
  },
  gutter: {
    small: 18,
    medium: 24,
    large: 30,
    xlarge: 30,
  },
  colors: {
    white: '#ffffff',
    black: '#010101',
    viewerBlack: '#121212',
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
    pewter: '#6b6b6b',
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
  spacingUnits,
  spaceAtBreakpoints: {
    small: {
      xs: spacingUnits['1'],
      s: spacingUnits['2'],
      m: spacingUnits['3'],
      l: spacingUnits['5'],
      xl: spacingUnits['7'],
    },
    medium: {
      xs: spacingUnits['1'],
      s: spacingUnits['2'],
      m: spacingUnits['4'],
      l: spacingUnits['6'],
      xl: spacingUnits['9'],
    },
    large: {
      xs: spacingUnits['1'],
      s: spacingUnits['3'],
      m: spacingUnits['5'],
      l: spacingUnits['8'],
      xl: spacingUnits['10'],
    },
  },
};

type SpaceSize = 'xs' | 's' | 'm' | 'l' | 'xl';
type SpaceProperty =
  | 'margin-bottom'
  | 'margin-top'
  | 'padding-bottom'
  | 'padding-top'
  | 'top'
  | 'bottom'
  | 'margin-left'
  | 'margin-right'
  | 'padding-left'
  | 'padding-right'
  | 'left'
  | 'right';

function makeSpacePropertyValues(
  size: SpaceSize,
  properties: SpaceProperty[],
  negative: ?boolean,
  overrides?: SpaceOverrides
): string {
  return ['small', 'medium', 'large']
    .map(bp => {
      return `@media (min-width: ${theme.sizes[bp]}px) {
      ${properties
        .map(
          p =>
            `${p}: ${negative ? '-' : ''}${
              overrides && overrides[bp]
                ? spacingUnits[overrides[bp]]
                : theme.spaceAtBreakpoints[bp][size]
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
