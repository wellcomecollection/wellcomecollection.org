import { createGlobalStyle, css } from 'styled-components';

import { Toggles } from '@weco/toggles';

import { fonts } from './base/fonts';
import { inlineFonts } from './base/inline-fonts';
import { layout } from './base/layout';
import { normalize } from './base/normalize';
import { row } from './base/row';
import { wellcomeNormalize } from './base/wellcome-normalize';
import { Size, themeValues } from './config';
import {
  makeFontSizeClasses,
  makeFontSizeOverrideClasses,
  typography,
} from './typography';
import { utilityClasses } from './utility-classes';

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

// We know these types to be true but typescript and `.keys` and `.reduce` doesn't play all that nice
// TODO: Remove type coercion
// see: https://fettblog.eu/typescript-better-object-keys/
const cls = {
  ...classes,
  ...sizesClasses,
  /* eslint-disable @typescript-eslint/no-explicit-any */
} as any as Classes & SizedClasses;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type GlobalStyleProps = {
  toggles?: Toggles;
  isFontsLoaded?: boolean;
};

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
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
          ${props => props.theme.media(size as Size)`
          display: none;
        `}
        }
        .${cls[size as Size].displayBlock} {
          ${props => props.theme.media(size as Size)`
          display: block;
        `}
        }
      `
    )}
  `}
  ${utilityClasses}
  ${normalize}
  ${wellcomeNormalize}
  ${layout}
  ${row}
  ${inlineFonts}
  ${fonts}
  ${makeFontSizeClasses()}
  ${makeFontSizeOverrideClasses()}
  ${typography}
`;

// Theme factory that creates a theme with appropriate color function based on toggles
export const createThemeValues = (toggles: Toggles) => {
  // Manipulate themeValues with toggles here

  return {
    ...themeValues,
    // Override sizes to use design system breakpoints when toggle is enabled
    sizes: themeValues.getSizes(toggles),
    // Override makeSpacePropertyValues to include toggles
    makeSpacePropertyValues: (
      size: Parameters<typeof themeValues.makeSpacePropertyValues>[0],
      properties: Parameters<typeof themeValues.makeSpacePropertyValues>[1],
      negative?: Parameters<typeof themeValues.makeSpacePropertyValues>[2],
      overrides?: Parameters<typeof themeValues.makeSpacePropertyValues>[3]
    ) =>
      themeValues.makeSpacePropertyValues(
        size,
        properties,
        negative,
        overrides,
        toggles
      ),
    // Override getSpaceValue to include toggles
    getSpaceValue: (
      size: Parameters<typeof themeValues.getSpaceValue>[0],
      breakpoint: Parameters<typeof themeValues.getSpaceValue>[1]
    ) => themeValues.getSpaceValue(size, breakpoint, toggles),
  };
};

// Static theme instance for backward compatibility
// Used by: TypeScript type definitions (styled.d.ts), test utilities, and Storybook configuration
// Production code should use ThemeProvider with createThemeValues(toggles) for toggle-aware themes
export default themeValues;
export { GlobalStyle, cls };
