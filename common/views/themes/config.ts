import {
  theme as designSystemTheme,
  ResponsiveValue,
} from '@wellcometrust/wellcome-design-system/theme';
import { css, keyframes } from 'styled-components';

import {
  ButtonColors,
  ButtonHierarchy,
} from '@weco/common/views/components/Buttons';
import {
  HorizontalSpaceProperty,
  SpaceOverrides,
  VerticalSpaceProperty,
} from '@weco/common/views/components/styled/Space';

type SpaceSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpaceProperty = HorizontalSpaceProperty | VerticalSpaceProperty;

export type ColumnKey =
  's' | 'm' | 'l' | 'xl' | 'shiftM' | 'shiftL' | 'shiftXl';

// The design system's colour tokens (`designSystemTheme.color`) are nested
// objects of tinted scales; we flatten them to a `.`-separated map (e.g.
// `neutral.10`, `ui.blue.40`) so they can be named in `theme.color(...)`.
const coreColorKeys = [
  'white',
  'black',
  'neutral',
  'pink',
  'yellow',
  'blue',
  'indigo',
  'teal',
  'orange',
  'green',
  'ui',
] as const;

type CoreColorSource = Pick<
  typeof designSystemTheme.color,
  (typeof coreColorKeys)[number]
>;

// Recursively derive the `.`-separated union of leaf (i.e. outermost) keys from
// a nested colour object, giving us `'white' | 'neutral.10' | 'ui.blue.40' |
// ...`. This keeps type safety: a name that isn't in the design system is a
// type error.
type FlattenColorKeys<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : FlattenColorKeys<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type DesignSystemColor = FlattenColorKeys<CoreColorSource>;

// Runtime flatten mirroring the type above.
function flattenColors(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  return Object.entries(obj).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        acc[path] = value;
      } else if (value && typeof value === 'object') {
        Object.assign(
          acc,
          flattenColors(value as Record<string, unknown>, path)
        );
      }

      return acc;
    },
    {}
  );
}

// We need an object containing only the 'core' colours from the design system…
const coreColorSource = coreColorKeys.reduce<Record<string, unknown>>(
  (acc, key) => {
    acc[key] = designSystemTheme.color[key];
    return acc;
  },
  {}
);
// …so the flattened result only contains the keys the `DesignSystemColor` type
// expects (we deliberately filter out the 'legacy' stuff)
const designSystemColors = flattenColors(coreColorSource) as Record<
  DesignSystemColor,
  string
>;

// Colour names from before the design system, kept as aliases for their
// nearest design system colour so existing call sites still work. Prefer
// design system names in new code. The series `color` field in Prismic stores
// some of these names, so they can't all go.
//
// An alias wins where both use the same name: `black` is `neutral.70`, the
// text colour, not the design system's black.
//
// Some rows are flagged because the design system has no purple, turquoise or
// salmon, so the nearest match is a poor visual fit. Adjust deliberately if
// design wants something else.
const colorAliases = {
  white: 'white',
  black: 'neutral.70',
  yellow: 'yellow.30', // FIXME: such yellow
  lightYellow: 'yellow.20',

  'accent.purple': 'neutral.50', // FIXME: no purple in core scales; nearest is a grey
  'accent.lightPurple': 'ui.grey.40', // FIXME: no purple in core scales; nearest is a grey
  'accent.turquoise': 'blue.50', // FIXME: no turquoise in core scales; nearest is a blue
  'accent.lightTurquoise': 'blue.20', // FIXME: no turquoise in core scales; nearest is a blue
  'accent.blue': 'indigo.60',
  'accent.lightBlue': 'blue.30',
  'accent.green': 'teal.40',
  'accent.lightGreen': 'green.40',
  'accent.salmon': 'orange.40',
  'accent.lightSalmon': 'orange.30',

  'neutral.200': 'neutral.05',
  'neutral.300': 'neutral.20',
  'neutral.400': 'neutral.20',
  'neutral.500': 'neutral.40',
  'neutral.600': 'neutral.50',
  'neutral.700': 'neutral.70',

  'warmNeutral.200': 'yellow.10',
  'warmNeutral.300': 'neutral.10',
  'warmNeutral.400': 'neutral.20',

  'validation.red': 'ui.red.40',
  'validation.green': 'teal.50', // FIXME: nearest is a teal, not a green

  'focus.yellow': 'yellow.30',
} as const satisfies Record<string, DesignSystemColor>;

export type ColorAlias = keyof typeof colorAliases;

// The aliases resolved to hex values, for anything that reads
// `theme.colors[...]` directly rather than via `color()`.
const colors = Object.fromEntries(
  (Object.keys(colorAliases) as ColorAlias[]).map(name => [
    name,
    designSystemColors[colorAliases[name]],
  ])
) as Record<ColorAlias, string>;

const passthroughColors = {
  transparent: 'transparent',
  inherit: 'inherit',
  currentColor: 'currentColor',
} as const;

type PassthroughColor = keyof typeof passthroughColors;

export type PaletteColor = ColorAlias | PassthroughColor;

/** Anything `theme.color(...)` accepts: an alias, a value CSS resolves itself,
 * or a design system colour.
 */
export type ThemeColor = PaletteColor | DesignSystemColor;

const isColorAlias = (name: ThemeColor): name is ColorAlias =>
  name in colorAliases;

const isPassthroughColor = (name: ThemeColor): name is PassthroughColor =>
  name in passthroughColors;

const getColor = (name: ThemeColor): string =>
  isColorAlias(name)
    ? colors[name]
    : isPassthroughColor(name)
      ? passthroughColors[name]
      : designSystemColors[name];

/** The page background. Anything that needs to blend into the page (e.g. a
 * decorative edge) should use this rather than `white`.
 */
export const pageBackgroundColor = 'neutral.05' satisfies DesignSystemColor;

/** The near-black backdrop behind images and video (e.g. the viewer canvas).
 * Darker than `black`, which is the text colour.
 */
export const mediaBackgroundColor = 'neutral.80' satisfies DesignSystemColor;

/** A design system colour by name, for styles outside a theme (e.g. passed to
 * a third-party script).
 */
export const designSystemColor = (
  name: DesignSystemColor | 'transparent'
): string => (name === 'transparent' ? name : designSystemColors[name]);

export const sizes = {
  zero: '0rem',
  sm: designSystemTheme.breakpoints.sm, // 48rem = 768px
  md: designSystemTheme.breakpoints.md, // 64rem = 1024px
  lg: designSystemTheme.breakpoints.lg, // 90rem = 1440px
  // TODO: try to get rid of these one-offs
  headerMedium: '51.5625rem', // 825px
  headerLarge: '65rem', // 1040px
};

const gutter = {
  small: designSystemTheme.grid.gutter.default, // 12px
  medium: designSystemTheme.grid.gutter.sm, // 24px
  large: '2.5rem', // 40px FIXME: this value isn't in the WDS repo but is in Figma
  xlarge: designSystemTheme.grid.gutter.lg, // 48px
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

const slateWhiteBlack: ButtonColors = {
  border: 'neutral.600',
  background: 'white',
  text: 'black',
};

type BrandButtonColor = DesignSystemColor | 'transparent';

type BrandButtonStateColors = {
  border: BrandButtonColor;
  background: BrandButtonColor;
  text: BrandButtonColor;
};

export type BrandButtonColors = {
  default: BrandButtonStateColors;
  active: BrandButtonStateColors;
  disabled: BrandButtonStateColors;
};

const filledDisabled: BrandButtonStateColors = {
  border: 'ui.grey.40',
  background: 'ui.grey.40',
  text: 'ui.grey.60',
};

const outlinedDisabled: BrandButtonStateColors = {
  border: 'ui.grey.40',
  background: 'transparent',
  text: 'ui.grey.40',
};

// Button colours from the brand designs. Only tertiary changes on a dark
// background; hover adds an underline rather than changing colour.
export const brandButtonColors: Record<
  ButtonHierarchy | 'tertiaryOnDark' | 'danger',
  BrandButtonColors
> = {
  primary: {
    default: {
      border: 'indigo.50',
      background: 'indigo.50',
      text: 'neutral.10',
    },
    active: {
      border: 'indigo.60',
      background: 'indigo.60',
      text: 'neutral.10',
    },
    disabled: filledDisabled,
  },
  secondary: {
    default: { border: 'blue.30', background: 'blue.30', text: 'neutral.70' },
    active: { border: 'blue.40', background: 'blue.40', text: 'neutral.70' },
    disabled: filledDisabled,
  },
  tertiary: {
    default: {
      border: 'neutral.70',
      background: 'transparent',
      text: 'neutral.70',
    },
    active: {
      border: 'neutral.80',
      background: 'transparent',
      text: 'neutral.80',
    },
    disabled: outlinedDisabled,
  },
  tertiaryOnDark: {
    default: { border: 'blue.30', background: 'transparent', text: 'blue.30' },
    active: { border: 'blue.40', background: 'transparent', text: 'blue.40' },
    disabled: outlinedDisabled,
  },
  // Pure black rather than neutral.70, which doesn't have enough contrast on
  // ui.red.40. There's no mid red, so pressing adds a darker stroke instead
  danger: {
    default: { border: 'ui.red.40', background: 'ui.red.40', text: 'black' },
    active: { border: 'ui.red.60', background: 'ui.red.40', text: 'black' },
    disabled: filledDisabled,
  },
};

export type Size = keyof typeof sizes;

// Factory functions that create media query helpers with specific sizes
export const createMedia =
  (activeSizes: typeof sizes) =>
  (sizeLabel: Size, minOrMaxWidth: 'min-width' | 'max-width' = 'min-width') =>
  (styles: TemplateStringsArray | string): string =>
    `@media (${minOrMaxWidth}: ${activeSizes[sizeLabel]}) {${styles}}`;

export const createMediaBetween =
  (activeSizes: typeof sizes) =>
  (minBreakpoint: Breakpoint, maxBreakpoint: Breakpoint) =>
  (styles: string): string => {
    const minWidth = `min-width: ${activeSizes[minBreakpoint]}`;
    const maxWidth = `max-width: calc(${activeSizes[maxBreakpoint]} - 0.0625rem)`;

    return `@media (${minWidth}) and (${maxWidth}) {
      ${styles}
    }`;
  };

// Default media query helpers (use standard sizes)
const media = createMedia(sizes);
const mediaBetween = createMediaBetween(sizes);

const breakpointNames = ['zero', 'sm', 'md'];

// Design system container padding values (5% across all breakpoints)
// but not exported yet
export const containerPadding = '5%';
const containerPaddingVw = '5vw';

// Where the content of a Container starts: half of the space left either side
// of its max width, plus its own padding, which is a share of the parent's width
export const containerEdge = (maxWidth: string) =>
  `calc(max(0px, (100% - ${maxWidth}) / 2) + ${containerPadding})`;

// Map current space sizes to design system responsive spacing
// xs → space.2xs, s → space.xs, m → space.sm, l → space.lg, xl → space.xl
const designSystemSpacing: Record<SpaceSize, ResponsiveValue> = {
  '2xs': designSystemTheme.spacing.responsive['space.2xs'],
  xs: designSystemTheme.spacing.responsive['space.xs'],
  sm: designSystemTheme.spacing.responsive['space.sm'],
  md: designSystemTheme.spacing.responsive['space.md'],
  lg: designSystemTheme.spacing.responsive['space.lg'],
  xl: designSystemTheme.spacing.responsive['space.xl'],
};

// Map spacingUnits to design system static spacing values
// Used for overrides parameter
type SpacingUnit =
  '050' | '075' | '100' | '150' | '200' | '300' | '400' | '600' | '1200';
const designSystemStaticSpacing: Record<SpacingUnit, string> = {
  '050': designSystemTheme.spacing.static['space.050'], // 4px → 0.25rem
  '075': designSystemTheme.spacing.static['space.075'], // 6px → 0.375rem
  '100': designSystemTheme.spacing.static['space.100'], // 8px → 0.5rem
  '150': designSystemTheme.spacing.static['space.150'], // 12px → 0.75rem
  '200': designSystemTheme.spacing.static['space.200'], // 16px → 1rem
  '300': designSystemTheme.spacing.static['space.300'], // 24px → 1.5rem
  '400': designSystemTheme.spacing.static['space.400'], // 32px → 2rem
  '600': designSystemTheme.spacing.static['space.600'], // 48px → 3rem
  '1200': designSystemTheme.spacing.static['space.1200'], // 96px → 6rem
};

// Map our breakpoint names to design system breakpoint keys
// TODO: remove this mapping, but only after the keys in the design system have been
// updated. They are currently 'default', 'sm', 'md', but they will soon change
// to e.g. 'xs', 'sm', 'md', 'lg', 'xl'
const BREAKPOINT_TO_DS_MAP: Record<
  'zero' | 'sm' | 'md',
  'default' | 'sm' | 'md'
> = {
  zero: 'default',
  sm: 'sm',
  md: 'md',
};

// Helper function to get a single spacing value (for use in calculations, negative values, etc.)
function getSpaceValue(
  size: SpaceSize,
  breakpoint: 'zero' | 'sm' | 'md'
): string {
  const dsSpacing = designSystemSpacing[size];
  return dsSpacing[BREAKPOINT_TO_DS_MAP[breakpoint]];
}

// Helper function to get override spacing values
function getSpaceOverrideValue(unit: SpacingUnit): string {
  return designSystemStaticSpacing[unit];
}

// Type for responsive spacing keys from the design system
type ResponsiveSpacingKey = keyof typeof designSystemTheme.spacing.responsive;

function responsiveSpaceMixin(size: ResponsiveSpacingKey, property: string) {
  return css`
    ${property}: ${designSystemTheme.spacing.responsive[size].default};

    @media (min-width: ${sizes.sm}) {
      ${property}: ${designSystemTheme.spacing.responsive[size].sm};
    }

    @media (min-width: ${sizes.md}) {
      ${property}: ${designSystemTheme.spacing.responsive[size].md};
    }
  `;
}

// When using this vw calc approach (e.g. in [conceptId]) the scrollbar width is not taken into account resulting in
// possible horizontal scroll. The simplest solution to get around this is to use pageGridOffset in conjunction
// with the hideOverflowX prop on PageLayout
function pageGridOffset(property: string): string {
  return `
  position: relative;
  ${property}: -${containerPaddingVw};

  ${media('lg')(`
    ${property}: calc((100vw - ${sizes.lg}) / 2 * -1 - ${containerPaddingVw});
  `)};
  `;
}

function makeSpacePropertyValues(
  size: SpaceSize,
  properties: SpaceProperty[],
  negative?: boolean,
  overrides?: SpaceOverrides
): string {
  return breakpointNames
    .map(bp => {
      // Use override if provided, otherwise use size-based spacing
      const baseValue =
        overrides && overrides[bp]
          ? getSpaceOverrideValue(overrides[bp])
          : getSpaceValue(size, bp as 'zero' | 'sm' | 'md');

      const finalValue = negative ? `calc(-1 * ${baseValue})` : baseValue;

      return `@media (min-width: ${sizes[bp]}) {
      ${properties.map(p => `${p}: ${finalValue};`).join('')}
    }`;
    })
    .join('');
}

function clampLines(lines: number) {
  return css`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: ${lines};
  `;
}

export const themeValues = {
  spacingUnit: 6,
  borderRadiusUnit: 6,
  transitionProperties: '150ms ease',
  iconDimension: 24,
  containerPadding,
  containerPaddingVw,
  sizes,
  gutter,
  basicBoxShadow: `0 2px 8px 0 rgb(18, 18, 18, 0.4)`,
  focusBoxShadow: `0 0 0 3px ${colors['focus.yellow']}`,
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
  spacingUnits: designSystemStaticSpacing,
  navHeight: 85,
  kioskNavigationHeight: 88, // Height of the KioskNavigation bar shown in all kiosk modes
  kioskTRBannersHeight: 172, // TR-specific top banners height (without navigation)
  // The layers that decide what covers what, lowest to highest. Small values
  // that only order things inside a single component stay local.
  // viewerLoading and kioskNavigation share a value as they never show together.
  zIndex: {
    header: 6,
    skipLink: 7, // Focused skip link, just above the header
    headerMenuOpen: 10, // The fixed header while the mobile menu is open
    apiToolbar: 100,
    viewerLoading: 1000,
    kioskNavigation: 1000,
    toggleWidget: 1001,
    modalOverlay: 1002,
    modalWindow: 1003,
    loadingIndicator: 1031,
    headerSearch: 9999,
    prismicPreviewBar: 2147483000,
  },
  fontVerticalOffset: '0.15em',
  colors,
  color: getColor,
  minCardHeight: 385,
  media,
  mediaBetween,
  makeSpacePropertyValues,
  getSpaceValue,
  responsiveSpaceMixin,
  pageGridOffset,
  getViewerHeight: (isTRKiosk: boolean, isNonTRKiosk: boolean) => {
    if (isTRKiosk) {
      return `calc(100vh - ${themeValues.kioskTRBannersHeight + themeValues.kioskNavigationHeight}px)`;
    } else if (isNonTRKiosk) {
      return `calc(100vh - ${themeValues.kioskNavigationHeight}px)`;
    } else {
      return `calc(100vh - ${themeValues.navHeight}px)`;
    }
  },
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
    slateWhiteBlack,
    greenGreenWhite,
  },
  spacedTextTopMargin: '1.55em',
  clampLines,
  typography: designSystemTheme.typography,
};

export type Breakpoint = keyof typeof sizes;
