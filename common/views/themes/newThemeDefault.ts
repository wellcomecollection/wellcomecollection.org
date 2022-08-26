import {
  css,
  CSSObject,
  SimpleInterpolation,
  createGlobalStyle,
} from 'styled-components';
import { SpaceOverrides } from '../components/styled/Space';
import {
  typography,
  makeFontSizeClasses,
  makeFontSizeOverrideClasses,
} from './typography';
import { utilityClasses } from './utility-classes';
import { normalize } from './base/normalize';
import { wellcomeNormalize } from './base/wellcome-normalize';
import { layout } from './base/layout';
import { container } from './base/container';
import { row } from './base/row';
import { inlineFonts } from './base/inline-fonts';
import { fonts } from './base/fonts';
import { themeValues, spacingUnits } from './newConfig';
import { grid } from './grid';

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

const newTheme = {
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

// We know these types to be true but typescript and `.keys` and `.reduce` doesn't play all that nice
// TODO: Remove type coersion
// see: https://fettblog.eu/typescript-better-object-keys/
const cls = {
  ...classes,
  ...sizesClasses,
} as any as Classes & SizedClasses;

export type GlobalStyleProps = {
  toggles?: { [key: string]: boolean };
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
  ${utilityClasses}
  ${normalize}
  ${wellcomeNormalize}
  ${layout}
  ${container}
  ${row}
  ${inlineFonts}
  ${fonts}
  ${makeFontSizeClasses()}
  ${makeFontSizeOverrideClasses()}
  ${typography}
  ${grid}
`;

export default newTheme;
export { GlobalStyle, cls };
