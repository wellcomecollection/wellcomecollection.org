import { keyframes } from 'styled-components';
import { ButtonColors } from '@weco/common/views/components/ButtonSolid/ButtonSolid';

export type ColumnKey =
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | 'shiftM'
  | 'shiftL'
  | 'shiftXl';

type ColorVariant = 'base' | 'light' | 'dark';
type GridProperties = {
  padding: number;
  gutter: number;
  columns: number;
  primaryStart: number;
  primaryEnd: number;
  secondaryStart: number;
  secondaryEnd: number;
  respond: Breakpoint[];
};
type GridConfig = {
  s: GridProperties;
  m: GridProperties;
  l: GridProperties;
  xl: GridProperties;
};

const grid: GridConfig = {
  s: {
    padding: 18,
    gutter: 18,
    columns: 12,
    primaryStart: 1,
    primaryEnd: 12,
    secondaryStart: 1,
    secondaryEnd: 12,
    respond: ['small', 'medium'],
  },
  m: {
    padding: 42,
    gutter: 24,
    columns: 12,
    primaryStart: 2,
    primaryEnd: 11,
    secondaryStart: 2,
    secondaryEnd: 11,
    respond: ['medium', 'large'],
  },
  l: {
    padding: 60,
    gutter: 30,
    columns: 12,
    primaryStart: 1,
    primaryEnd: 7,
    secondaryStart: 8,
    secondaryEnd: 12,
    respond: ['large', 'xlarge'],
  },
  xl: {
    padding: 60,
    gutter: 30,
    columns: 12,
    primaryStart: 1,
    primaryEnd: 7,
    secondaryStart: 8,
    secondaryEnd: 12,
    respond: ['xlarge'],
  },
};

export const spacingUnits = {
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

export const colors = {
  // suggested new colors

  // inherit: { base: 'inherit', dark: '', light: '' },
  // currentColor: { base: 'currentColor', dark: '', light: '' },
  // transparent: {
  //   base: 'transparent',
  //   dark: 'transparent',
  //   light: 'transparent',
  // },
  // white: { base: '#ffffff', dark: '', light: '' },
  // black: { base: '#121212', dark: '', light: '' },
  // greys: {
  //   2: '#323232', // 20
  //   4: '#6b6b6b', // 42
  //   5: '#8f8f8f', // 56
  //   8: '#d9d9d9', // 85
  //   9: '#e8e8e8', // 91
  // },
  // cream: { base: '#d9d8d0', dark: '', light: '#edece4' },
  // purple: { base: '#724e91', dark: '', light: '#baa4cd' },
  // turquoise: { base: '#1dbebb', dark: '', light: '#a2eeed' },
  // blue: { base: '#27476e', dark: '', light: '#a4bfdf' },
  // khaki: { base: '#4f7d68', dark: '', light: '#9bc0af' },
  // salmon: { base: '#ff6f59', dark: '', light: '#ff9585' },
  // yellow: { base: '#ffce3c', dark: '', light: '#ffebad' },
  // red: { base: '#e01b2f', dark: '#c1192a', light: '' },
  // green: { base: '#0b7051', dark: '#146a5c', light: '' },

  //
  // unchanged
  white: { base: '#ffffff', dark: '', light: '' },
  black: { base: '#121212', dark: '', light: '' },
  // the dark value is legacy, do we change it?
  red: { base: '#e01b2f', dark: '#c1192a', light: '' },
  transparent: {
    base: 'transparent',
    dark: 'transparent',
    light: 'transparent',
  },
  inherit: { base: 'inherit', dark: '', light: '' },
  currentColor: { base: 'currentColor', dark: '', light: '' },

  //
  // existing names, new shade
  purple: { base: '#724e91', dark: '', light: '#baa4cd' },
  turquoise: { base: '#1dbebb', dark: '', light: '#a2eeed' },
  // the dark value is legacy, do we change it?
  green: { base: '#0b7051', dark: '#146a5c', light: '' },
  // there's an even paler yellow, what do we do with it? (#fff9e6)
  yellow: { base: '#ffce3c', dark: '', light: '#ffebad' },
  cream: { base: '#d9d8d0', dark: '', light: '#edece4' },

  //
  // all new, used nowhere
  blue: { base: '#27476e', dark: '', light: '#a4bfdf' },
  khaki: { base: '#4f7d68', dark: '', light: '#9bc0af' },
  salmon: { base: '#ff6f59', dark: '', light: '#ff9585' },

  // greys
  // pumice becomes cream
  smoke: { base: '#e8e8e8', dark: '', light: '' },
  pumice: { base: '#d9d8d0', dark: '', light: '' },
  silver: { base: '#8f8f8f', dark: '', light: '' },
  pewter: { base: '#6b6b6b', dark: '', light: '' },
  // the dark value is legacy, replace it with just charcoal
  // Used once catalogue/webapp/components/IIIFViewer/IIIFViewer.tsx
  charcoal: { base: '#323232', dark: '#323232', light: '' },

  //
  // old colours that don't have an equivalent in the new palette
  // i've replaced them with some equivalents, but eventually go through codebase and change name

  // teal: { base: '#006272', dark: '', light: '' },
  // replaced with khaki?
  teal: { base: '#4f7d68', dark: '', light: '' },

  // not used anywhere
  // cyan: { base: '#298187', dark: '', light: '' },

  // orange: { base: '#e87500', dark: '', light: '' },
  // replaced with salmon?
  orange: { base: '#ff6f59', dark: '', light: '' },

  // not used anywhere but PaletteColorPicker, so commented it out of it
  // brown: { base: '#815e48', dark: '', light: '' },

  // marble: { base: '#bcbab5', dark: '', light: '' },
  // replaced with pumice/grey8
  marble: { base: '#d9d9d9', dark: '', light: '' },

  //
  // Exhibition guide colors
  // Replace these in the codebase eventually to use the color names above
  // newPaletteOrange: { base: '#e7b792', dark: '', light: '' },
  // salmon light?
  newPaletteOrange: { base: '#ff9585', dark: '', light: '' },
  //
  // newPaletteMint: { base: '#acddbd', dark: '', light: '' },
  // khaki light?
  newPaletteMint: { base: '#9bc0af', dark: '', light: '' },
  //
  // newPaletteBlue: { base: '#7bc1ce', dark: '', light: '' },
  // doesn't match anything, using turquoise light
  newPaletteBlue: { base: '#a2eeed', dark: '', light: '' },
  //
  // newPaletteSalmon: { base: '#cfa1af', dark: '', light: '' },
  // replace with purple light?
  newPaletteSalmon: { base: '#baa4cd', dark: '', light: '' },
};

const getColor = (name: PaletteColor, variant: ColorVariant = 'base'): string =>
  colors[name][variant];

export const sizes = {
  small: 0,
  medium: 600,
  large: 960,
  xlarge: 1338,
  // Tweakpoints
  // Occasionally we need to respond to specific breakpoints beyond the defaults
  headerMedium: 825,
  headerLarge: 1040,
};

const defaultButtonColors: ButtonColors = {
  border: 'green',
  background: 'green',
  text: 'white',
};

const dangerButtonColors: ButtonColors = {
  border: 'red',
  background: 'red',
  text: 'white',
};

// Button color naming convention: [border][Background][Text]
// TODO: Work out and document which variants we want to use when/where/why
// (and possibly improve naming at that point)
const charcoalWhiteCharcoal: ButtonColors = {
  border: 'charcoal',
  background: 'white',
  text: 'charcoal',
};

const greenTransparentGreen: ButtonColors = {
  border: 'green',
  background: 'transparent',
  text: 'green',
};

const whiteTransparentWhite: ButtonColors = {
  border: 'white',
  background: 'transparent',
  text: 'white',
};

export const themeValues = {
  spacingUnit: 6,
  borderRadiusUnit: 6,
  transitionProperties: '150ms ease',
  iconDimension: 24,
  containerPadding: {
    small: 18,
    medium: 42,
    large: 60,
    xlarge: 60,
  },
  sizes,
  gutter: {
    small: 18,
    medium: 24,
    large: 30,
    xlarge: 30,
  },
  focusBoxShadow: '0 0 0 3px rgba(43, 136, 143, 1)',
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
  navHeight: 85,
  fontVerticalOffset: '0.15em',
  grid,
  colors,
  color: getColor,
  minCardHeight: 385,
  buttonColors: {
    default: defaultButtonColors,
    danger: dangerButtonColors,
    charcoalWhiteCharcoal,
    greenTransparentGreen,
    whiteTransparentWhite,
  },
};

export type Breakpoint = keyof typeof sizes;
export type PaletteColor = keyof typeof colors;
