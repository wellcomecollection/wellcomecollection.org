import { keyframes } from 'styled-components';

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
  white: { base: '#ffffff', dark: '', light: '' },
  black: { base: '#121212', dark: '', light: '' },
  purple: { base: '#944aa0', dark: '', light: '' },
  teal: { base: '#006272', dark: '', light: '' },
  cyan: { base: '#298187', dark: '', light: '' },
  turquoise: { base: '#5cb8bf', dark: '', light: '#d3e8e6' },
  red: { base: '#e01b2f', dark: '#c1192a', light: '' },
  orange: { base: '#e87500', dark: '', light: '' },
  yellow: { base: '#ffce3c', dark: '', light: '#fff5d8' },
  brown: { base: '#815e48', dark: '', light: '' },
  cream: { base: '#f0ede3', dark: '', light: '' },
  green: { base: '#007868', dark: '#146a5c', light: '' },
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
  greenNewPalette: { base: '#e7b792', dark: '', light: '' },
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
};

export type Breakpoint = keyof typeof sizes;
export type PaletteColor = keyof typeof colors;
