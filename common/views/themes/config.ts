import {
  theme as designSystemTheme,
  ResponsiveValue,
} from '@wellcometrust/wellcome-design-system/theme';
import { keyframes } from 'styled-components';

import { ButtonColors } from '@weco/common/views/components/Buttons';
import {
  HorizontalSpaceProperty,
  SpaceOverrides,
  VerticalSpaceProperty,
} from '@weco/common/views/components/styled/Space';
import { Toggles } from '@weco/toggles';

type SpaceSize = 'xs' | 's' | 'm' | 'l' | 'xl';
type SpaceProperty = HorizontalSpaceProperty | VerticalSpaceProperty;

export type ColumnKey =
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | 'shiftM'
  | 'shiftL'
  | 'shiftXl';

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

// suggested new colors
const colors = {
  // Core
  // Wrap in core? Looks better for lightYellow but worse for the others...
  white: '#ffffff',
  black: '#121212',
  yellow: '#ffce3c',
  lightYellow: '#ffebad',

  // Accents
  'accent.purple': '#724e91',
  'accent.lightPurple': '#baa4cd',
  'accent.turquoise': '#1dbebb',
  'accent.lightTurquoise': '#a2eeed',
  'accent.blue': '#27476e',
  'accent.lightBlue': '#a4bfdf',
  'accent.green': '#4f7d68',
  'accent.lightGreen': '#9bc0af',
  'accent.salmon': '#ff6f59',
  'accent.lightSalmon': '#ff9585',

  // Neutral is a greyscale. Some have a matching warm colour, which sometimes suits our core yellow best.
  // Their HSL Lightness is commented next to them, which explains how some match warm colours.
  'neutral.200': '#fbfaf4', // lightness: 97 - matches warmNeutral.200
  'neutral.300': '#e8e8e8', // lightness: 91 - matches warmNeutral.300
  'neutral.400': '#d9d9d9', // lightness: 85 - matches warmNeutral.400
  'neutral.500': '#8f8f8f', // lightness: 56
  'neutral.600': '#6a6a6a', // suggested: lightness: 42
  'neutral.700': '#323232', // lightness: 20

  // Warm neutrals have equivalents in neutral (see lightness), but with a tinge of yellow to match the core colour.
  'warmNeutral.200': '#fff9e6', // lightness: 95 - matches neutral.200
  'warmNeutral.300': '#edece4', // lightness: 91 - matches neutral.300
  'warmNeutral.400': '#d9d8d0', // lightness: 83 - matches neutral.400

  // Validation, should only be used for that purpose. Consider other colours for other purposes.
  'validation.red': '#e01b2f',
  'validation.green': '#0b7051',

  // Focus, should only be used for that purpose.
  'focus.yellow': '#ffea00',
};

const getColor = (name: PaletteColor): string => {
  // In some cases, these get passed in, see ButtonColors for example.
  // But better not to use it if possible.
  if (['currentColor', 'transparent', 'inherit'].includes(name)) return name;

  return colors[name];
};

// Convert rem to px (1rem = 16px)
const remToPx = (rem: string): number => parseFloat(rem) * 16;

// Design system breakpoints in pixels
const designSystemBreakpoints = {
  small: 0,
  medium: remToPx(designSystemTheme.breakpoints.sm), // 48rem = 768px
  large: remToPx(designSystemTheme.breakpoints.md), // 64rem = 1024px
  xlarge: remToPx(designSystemTheme.breakpoints.lg), // 90rem = 1440px
  // Tweakpoints
  // Occasionally we need to respond to specific breakpoints beyond the defaults
  headerMedium: 825,
  headerLarge: 1040,
};

// Legacy breakpoints
const legacyBreakpoints = {
  small: 0,
  medium: 600,
  large: 960,
  xlarge: 1338,
  // Tweakpoints
  // Occasionally we need to respond to specific breakpoints beyond the defaults
  headerMedium: 825,
  headerLarge: 1040,
};

// Default export uses legacy breakpoints for backward compatibility
export const sizes = legacyBreakpoints;

// Helper function to get sizes based on toggle state
export const getSizes = (toggles?: Toggles) => {
  return toggles?.designSystemBreakpoints?.value
    ? designSystemBreakpoints
    : legacyBreakpoints;
};

const defaultButtonColors: ButtonColors = {
  border: 'accent.green',
  background: 'accent.green',
  text: 'white',
};

const dangerButtonColors: ButtonColors = {
  border: 'validation.red',
  background: 'validation.red',
  text: 'white',
};

// Button color naming convention: [border][Background][Text]
// TODO: Work out and document which variants we want to use when/where/why
// (and possibly improve naming at that point)
const charcoalWhiteCharcoal: ButtonColors = {
  border: 'neutral.700', // legacy charcoal color
  background: 'white',
  text: 'neutral.700', // legacy charcoal color
};

const greenTransparentGreen: ButtonColors = {
  border: 'accent.green',
  background: 'transparent',
  text: 'accent.green',
};

const greenGreenWhite: ButtonColors = {
  border: 'accent.green',
  background: 'accent.green',
  text: 'white',
};

const whiteTransparentWhite: ButtonColors = {
  border: 'white',
  background: 'transparent',
  text: 'white',
};

const pumiceTransparentCharcoal: ButtonColors = {
  border: 'warmNeutral.400', // legacy pumice color
  background: 'transparent',
  text: 'neutral.700', // legacy charcoal color
};

const charcoalTransparentCharcoal: ButtonColors = {
  border: 'neutral.700', // legacy charcoal color
  background: 'transparent',
  text: 'neutral.700', // legacy charcoal color
};

const charcoalTransparentBlack: ButtonColors = {
  border: 'neutral.700', // legacy charcoal color
  background: 'transparent',
  text: 'black',
};

const marbleWhiteCharcoal: ButtonColors = {
  border: 'neutral.400', // legacy pumice color
  background: 'white',
  text: 'neutral.700', // legacy charcoal color
};

// New button style introduction
// If we chose to move forward with new buttons
// Remove border prop
const yellowYellowBlack: ButtonColors = {
  border: 'yellow',
  background: 'yellow',
  text: 'black',
};

const whiteWhiteCharcoal: ButtonColors = {
  border: 'white',
  background: 'white',
  text: 'neutral.700', // legacy charcoal color
};

const silverTransparentBlack: ButtonColors = {
  border: 'neutral.300',
  background: 'transparent',
  text: 'black',
};

const slateTransparentBlack: ButtonColors = {
  border: 'neutral.600',
  background: 'transparent',
  text: 'black',
};

export type Size = keyof typeof sizes;

// Note: These functions create closures over the static 'sizes' variable.
// For toggle-aware breakpoints, the theme object's 'sizes' property gets overridden
// in createThemeValues(), but these functions will still reference the static export.
// This is intentional for styled-components which generate CSS at component definition time.
// For runtime breakpoint logic, use theme.sizes directly in JavaScript.
const media =
  (sizeLabel: Size, minOrMaxWidth: 'min-width' | 'max-width' = 'min-width') =>
  (styles: TemplateStringsArray | string): string =>
    `@media (${minOrMaxWidth}: ${sizes[sizeLabel]}px) {${styles}}`;

const mediaBetween =
  (minBreakpoint: Breakpoint, maxBreakpoint: Breakpoint) =>
  (styles: string): string => {
    const minWidth = `min-width: ${sizes[minBreakpoint]}px`;
    const maxWidth = `max-width: ${sizes[maxBreakpoint] - 1}px`;

    return `@media (${minWidth}) and (${maxWidth}) {
      ${styles}
    }`;
  };

const breakpointNames = ['small', 'medium', 'large'];

const containerPadding = {
  small: 18,
  medium: 42,
  large: 60,
  xlarge: 60,
};

const spaceAtBreakpoints = {
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
};

// Map current space sizes to design system responsive spacing
// xs → space.2xs, s → space.xs, m → space.sm, l → space.lg, xl → space.xl
const designSystemSpacing: Record<SpaceSize, ResponsiveValue> = {
  xs: designSystemTheme.spacing.responsive['space.2xs'],
  s: designSystemTheme.spacing.responsive['space.xs'],
  m: designSystemTheme.spacing.responsive['space.sm'],
  l: designSystemTheme.spacing.responsive['space.md'],
  xl: designSystemTheme.spacing.responsive['space.xl'],
};

// Map spacingUnits to design system static spacing values
// Used for overrides parameter
const designSystemStaticSpacing: Record<keyof typeof spacingUnits, string> = {
  '1': designSystemTheme.spacing.static['space.050'], // 4px → 0.25rem
  '2': designSystemTheme.spacing.static['space.075'], // 6px → 0.375rem
  '3': designSystemTheme.spacing.static['space.100'], // 8px → 0.5rem
  '4': designSystemTheme.spacing.static['space.150'], // 12px → 0.75rem
  '5': designSystemTheme.spacing.static['space.200'], // 16px → 1rem
  '6': designSystemTheme.spacing.static['space.300'], // 24px → 1.5rem
  '7': designSystemTheme.spacing.static['space.400'], // 30px → 2rem (closest match)
  '8': designSystemTheme.spacing.static['space.400'], // 32px → 2rem (closest match)
  '9': designSystemTheme.spacing.static['space.600'], // 46px → 3rem (closest match)
  '10': designSystemTheme.spacing.static['space.1200'], // 64px → 6rem (closest match)
};

// Map our breakpoint names to design system breakpoint keys
const BREAKPOINT_TO_DS_MAP: Record<
  'small' | 'medium' | 'large',
  'default' | 'sm' | 'md'
> = {
  small: 'default',
  medium: 'sm',
  large: 'md',
};

// Helper function to get a single spacing value (for use in calculations, negative values, etc.)
// Returns the appropriate value based on whether design system spacing is enabled
function getSpaceValue(
  size: SpaceSize,
  breakpoint: 'small' | 'medium' | 'large',
  toggles?: Toggles
): string {
  if (toggles?.designSystemSpacing?.value) {
    const dsSpacing = designSystemSpacing[size];
    return dsSpacing[BREAKPOINT_TO_DS_MAP[breakpoint]];
  }

  // Default: return pixel value
  return `${spaceAtBreakpoints[breakpoint][size]}px`;
}

// Helper function to get override spacing values
// Returns the appropriate value based on whether design system spacing is enabled
function getSpaceOverrideValue(
  unit: keyof typeof spacingUnits,
  toggles?: Toggles
): string {
  if (toggles?.designSystemSpacing?.value) {
    return designSystemStaticSpacing[unit];
  }
  return `${spacingUnits[unit]}px`;
}

// When using this vw calc approach (e.g. in [conceptId]) the scrollbar width is not taken into account resulting in
// possible horizontal scroll. The simplest solution to get around this is to use pageGridOffset in conjunction
// with the hideOverflowX prop on PageLayout
function pageGridOffset(property: string): string {
  return `
  position: relative;
  ${property}: -${containerPadding.small}px;

  ${media('medium')(`
    ${property}: -${containerPadding.medium}px;
    `)}

  ${media('large')(`
    ${property}: -${containerPadding.large}px;
    `)}

  ${media('xlarge')(`
    ${property}: calc((100vw - ${sizes.xlarge}px) / 2 * -1 - ${containerPadding.xlarge}px);
  `)};
  `;
}

function makeSpacePropertyValues(
  size: SpaceSize,
  properties: SpaceProperty[],
  negative?: boolean,
  overrides?: SpaceOverrides,
  toggles?: Toggles
): string {
  return breakpointNames
    .map(bp => {
      // Use override if provided, otherwise use size-based spacing
      const baseValue =
        overrides && overrides[bp]
          ? getSpaceOverrideValue(overrides[bp], toggles)
          : getSpaceValue(size, bp as 'small' | 'medium' | 'large', toggles);

      // Handle negative values appropriately for design system vs legacy
      const finalValue = negative
        ? toggles?.designSystemSpacing?.value
          ? `calc(-1 * ${baseValue})`
          : `-${baseValue}` // baseValue already includes 'px' from getSpaceValue
        : baseValue;

      return `@media (min-width: ${sizes[bp]}px) {
      ${properties.map(p => `${p}: ${finalValue};`).join('')}
    }`;
    })
    .join('');
}

export const themeValues = {
  spacingUnit: 6,
  borderRadiusUnit: 6,
  transitionProperties: '150ms ease',
  iconDimension: 24,
  containerPadding,
  sizes,
  gutter: {
    small: 18,
    medium: 24,
    large: 30,
    xlarge: 30,
  },
  basicBoxShadow: `0 2px 8px 0 rgb(18, 18, 18, 0.4)`,
  focusBoxShadow: `0 0 0 3px ${colors['focus.yellow']}`,
  // Problem: https://github.com/wellcomecollection/wellcomecollection.org/issues/10237
  // Solution: https://benmyers.dev/blog/whcm-outlines/
  highContrastOutlineFix: `3px solid transparent`,
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
  spaceAtBreakpoints,
  navHeight: 85,
  fontVerticalOffset: '0.15em',
  grid,
  colors,
  color: getColor,
  minCardHeight: 385,
  media,
  mediaBetween,
  makeSpacePropertyValues,
  getSpaceValue,
  getSizes,
  pageGridOffset,
  buttonColors: {
    default: defaultButtonColors,
    danger: dangerButtonColors,
    charcoalWhiteCharcoal,
    greenTransparentGreen,
    whiteTransparentWhite,
    pumiceTransparentCharcoal,
    charcoalTransparentCharcoal,
    charcoalTransparentBlack,
    marbleWhiteCharcoal,
    yellowYellowBlack,
    whiteWhiteCharcoal,
    silverTransparentBlack,
    slateTransparentBlack,
    greenGreenWhite,
  },
  spacedTextTopMargin: '1.55em',
};

export type Breakpoint = keyof typeof sizes;

export type PaletteColor =
  | keyof typeof colors
  | 'transparent'
  | 'inherit'
  | 'currentColor';
