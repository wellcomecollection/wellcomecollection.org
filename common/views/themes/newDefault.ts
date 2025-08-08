import { createGlobalStyle, css } from 'styled-components';

import {
  HorizontalSpaceProperty,
  SpaceOverrides,
  VerticalSpaceProperty,
} from '@weco/common/views/components/styled/Space';
import { Toggles } from '@weco/toggles';

import { fonts } from './base/fonts';
import { inlineFonts } from './base/inline-fonts';
import { layout } from './base/layout';
import { normalize } from './base/normalize';
import { row } from './base/row';
import { wellcomeNormalize } from './base/wellcome-normalize';
import { Size, spacingUnits, themeValues } from './newConfig';
import {
  makeFontSizeClasses,
  makeFontSizeOverrideClasses,
  typography,
} from './typography';
import { utilityClasses } from './utility-classes';

type SpaceSize = 'xs' | 's' | 'm' | 'l' | 'xl';
type SpaceProperty = HorizontalSpaceProperty | VerticalSpaceProperty;

const breakpointNames = ['small', 'medium', 'large'];

// When using this vw calc approach (e.g. in [conceptId]) the scrollbar width is not taken into account resulting in
// possible horizontal scroll. The simplest solution to get around this is to use pageGridOffset in conjuction
// with the hideOverflowX prop on PageLayout
function pageGridOffset(property: string): string {
  return `
  position: relative;
  ${property}: -${themeValues.containerPadding.small}px;

  ${themeValues.media('medium')(`
    ${property}: -${themeValues.containerPadding.medium}px;
    `)}

  ${themeValues.media('large')(`
    ${property}: -${themeValues.containerPadding.large}px;
    `)}

  ${themeValues.media('xlarge')(`
    ${property}: calc((100vw - ${themeValues.sizes.xlarge}px) / 2 * -1 - ${themeValues.containerPadding.xlarge}px);
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

const newTheme = {
  ...themeValues,
  makeSpacePropertyValues,
  pageGridOffset,
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

export default newTheme;
export { GlobalStyle, cls };
