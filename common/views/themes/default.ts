import {
  css,
  CSSObject,
  keyframes,
  SimpleInterpolation,
  createGlobalStyle,
} from 'styled-components';
import { SpaceOverrides } from '../components/styled/Space';

type ColorVariant = 'base' | 'light' | 'dark';
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

const fontSizeUnits = {
  '1': 14,
  '2': 15,
  '3': 16,
  '4': 18,
  '5': 20,
  '6': 22,
  '7': 24,
  '8': 28,
  '9': 32,
  '10;': 40,
  '11': 50,
};

const fontSizesAtBreakpoints = {
  small: {
    0: fontSizeUnits[9],
    1: fontSizeUnits[8],
    2: fontSizeUnits[7],
    3: fontSizeUnits[6],
    4: fontSizeUnits[3],
    5: fontSizeUnits[2],
    6: fontSizeUnits[1],
  },
  medium: {
    0: fontSizeUnits[10],
    1: fontSizeUnits[9],
    2: fontSizeUnits[8],
    3: fontSizeUnits[6],
    4: fontSizeUnits[4],
    5: fontSizeUnits[2],
    6: fontSizeUnits[1],
  },
  large: {
    0: fontSizeUnits[11],
    1: fontSizeUnits[10],
    2: fontSizeUnits[9],
    3: fontSizeUnits[7],
    4: fontSizeUnits[5],
    5: fontSizeUnits[3],
    6: fontSizeUnits[1],
  },
};

// When units are `number`s, we assume pixels
const themeValues = {
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
    white: { base: '#ffffff', dark: '', light: '' },
    black: { base: '#010101', dark: '', light: '' },
    viewerBlack: { base: '#121212', dark: '', light: '' },
    purple: { base: '#944aa0', dark: '', light: '' },
    teal: { base: '#006272', dark: '', light: '' },
    cyan: { base: '#298187', dark: '', light: '' },
    turquoise: { base: '#5cb8bf', dark: '', light: '' },
    red: { base: '#e01b2f', dark: '', light: '' },
    orange: { base: '#e87500', dark: '', light: '' },
    yellow: { base: '#ffce3c', dark: '', light: '#fff5d8' },
    brown: { base: '#815e48', dark: '', light: '' },
    cream: { base: '#f0ede3', dark: '', light: '' },
    green: { base: '#00786c', dark: '#146a5c', light: '' },
    charcoal: { base: '#323232', dark: '#2e2e2e', light: '' },
    pewter: { base: '#6b6b6b', dark: '', light: '' },
    silver: { base: '#8f8f8f', dark: '', light: '' },
    marble: { base: '#bcbab5', dark: '', light: '' },
    pumice: { base: '#d9d6ce', dark: '', light: '' },
    smoke: { base: '#e8e8e8', dark: '', light: '' },
    // The following 'black' is only to be used for the item viewer
    coal: { base: '#1f1f1f', dark: '', light: '' },
    //
    transparent: {
      base: 'transparent',
      dark: 'transparent',
      light: 'transparent',
    },
    'transparent-black': {
      base: 'rgba(29, 29, 29, 0.61)',
      dark: '',
      light: '',
    },
    // Opacity value explanation; We use transparent to provide a background to white text which overlays a variety of images (therefore unknown colour contrast).  This opacity is the lightest we can go, while still providing sufficient contrast to pass WCAG guidlines, when it is displayed above a white background, i.e. worst case scenario.
    inherit: { base: 'inherit', dark: '', light: '' },
    currentColor: { base: 'currentColor', dark: '', light: '' },
  },

  // Keyboard focus uses a hard box shadow of 0.7 opacity 'turquoise'
  focusBoxShadow: '0 0 0 3px rgba(92, 184, 191, 0.7)',
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
  color(name: string, variant: ColorVariant = 'base'): string {
    return this.colors[name][variant];
  },
};

const breakpointNames = ['small', 'medium', 'large'];

function makeSpacePropertyValues(
  size: SpaceSize,
  properties: SpaceProperty[],
  negative?: boolean,
  overrides?: SpaceOverrides
): string {
  return breakpointNames
    .map(bp => {
      return `@media (min-width: ${themeValues.sizes[bp]}px) {
      ${properties
        .map(
          p =>
            `${p}: ${negative ? '-' : ''}${
              overrides && overrides[bp]
                ? spacingUnits[overrides[bp]]
                : themeValues.spaceAtBreakpoints[bp][size]
            }px;`
        )
        .join('')}
    }`;
    })
    .join('');
}

function makeFontSizeClasses() {
  return breakpointNames
    .map(bp => {
      return `@media (min-width: ${themeValues.sizes[bp]}px) {
      ${Object.entries(fontSizesAtBreakpoints[bp])
        .map(([key, value]) => {
          return `.font-size-${key} {font-size: ${value}px}`;
        })
        .join(' ')}
    }`;
    })
    .join(' ');
}

function overridesAtBreakpoint(bp) {
  return Object.entries(fontSizeUnits)
    .map(([key, value]) => {
      return `.font-size-override-${bp}-${key} {font-size: ${value}px}`;
    })
    .join(' ');
}

function makeFontSizeOverrideClasses() {
  return breakpointNames
    .map(bp => {
      const minMax =
        bp === 'small'
          ? ['small', 'medium']
          : bp === 'medium'
          ? ['medium', 'large']
          : ['large'];

      if (minMax.length === 2) {
        return `@media (min-width: ${
          themeValues.sizes[minMax[0]]
        }px) and (max-width: ${themeValues.sizes[minMax[1]]}px) {
        ${overridesAtBreakpoint(bp)}
      }`;
      } else {
        return `@media (min-width: ${themeValues.sizes[minMax[0]]}px) {
        ${overridesAtBreakpoint(bp)}
      }`;
      }
    })
    .join(' ');
}
// https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md#media-templates
// using min-width because of
// https://zellwk.com/blog/how-to-write-mobile-first-css/
export type Size = keyof typeof themeValues.sizes;
type MediaMethodArgs = [
  TemplateStringsArray | CSSObject,
  SimpleInterpolation[]
];

const media = Object.keys(themeValues.sizes).reduce((acc, label) => {
  acc[label] = (...args: MediaMethodArgs) => css`
    @media (min-width: ${themeValues.sizes[label]}px) {
      ${css(...args)}
    }
  `;
  return acc;
}, {} as Record<Size, (...args: MediaMethodArgs) => string>);

const theme = {
  ...themeValues,
  media,
  makeSpacePropertyValues,
};

type Classes = typeof classes;
const classes = {
  displayNone: 'display-none',
  displayBlock: 'display-block',
};
type SizedClasses = {
  small: Classes;
  medium: Classes;
  large: Classes;
  xlarge: Classes;
};

const sizesClasses = Object.keys(themeValues.sizes).reduce((acc, size) => {
  const o = Object.entries(classes).reduce((acc, [key, val]) => {
    return {
      ...acc,
      [key]: `${size}-${val}`,
    };
  }, {});

  return {
    ...acc,
    [size]: o,
  };
}, {});

// I know this is the case, but typescript and `.keys` and `.reduce` doesn't play all that nice
// TODO: Make sure the implementation meets these types
// see: https://fettblog.eu/typescript-better-object-keys/
const cls = ({
  ...classes,
  ...sizesClasses,
} as any) as Classes & SizedClasses;

const GlobalStyle = createGlobalStyle`
  ${css`
    .${cls.displayBlock} {
      display: block;
    }
    .${cls.displayNone} {
      display: none;
    }
  `}
  ${css`
    ${Object.keys(themeValues.sizes).map(
      size => css`
        .${cls[size as Size].displayNone} {
          ${props => props.theme.media[size]`
          display: none;
        `}
        }
        .${cls[size as Size].displayBlock} {
          ${props => props.theme.media[size]`
          display: block;
        `}
        }
      `
    )}
  `}
  ${makeFontSizeClasses()}
  ${makeFontSizeOverrideClasses()}
`;

export default theme;
export { GlobalStyle, cls };
