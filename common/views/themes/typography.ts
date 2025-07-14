import { css } from 'styled-components';

import { themeValues } from './config';
import { GlobalStyleProps } from './default';

const breakpointNames = ['small', 'medium', 'large'];
const oneRem = 16;

const fontSizeUnits = {
  '1': 14 / oneRem, // 0.875rem
  '2': 15 / oneRem, // 0.9375rem
  '3': 15.9 / oneRem, // 0.99375rem
  '4': 18 / oneRem, // 1.125rem
  '5': 18.8 / oneRem, // 1.175rem
  '6': 21.6 / oneRem, // 1.35rem
  '7': 24 / oneRem, // 1.5rem
  '8': 28 / oneRem, // 1.75rem
  '9': 32 / oneRem, // 2rem
  '10': 40 / oneRem, // 2.5rem
  '11': 50 / oneRem, // 3.125rem
};

export const fontSizesAtBreakpoints = {
  small: {
    0: fontSizeUnits[9],
    1: fontSizeUnits[8],
    2: fontSizeUnits[7],
    3: fontSizeUnits[5],
    4: fontSizeUnits[3],
    5: fontSizeUnits[2],
    6: fontSizeUnits[1],
  },
  medium: {
    0: fontSizeUnits[10],
    1: fontSizeUnits[9],
    2: fontSizeUnits[7],
    3: fontSizeUnits[6],
    4: fontSizeUnits[4],
    5: fontSizeUnits[2],
    6: fontSizeUnits[1],
  },
  large: {
    0: fontSizeUnits[11],
    1: fontSizeUnits[10],
    2: fontSizeUnits[8],
    3: fontSizeUnits[6],
    4: fontSizeUnits[5],
    5: fontSizeUnits[3],
    6: fontSizeUnits[1],
  },
};

const fontFamilies = {
  intr: {
    base: `Inter, sans-serif;`,
    full: `Inter, sans-serif;`,
  },
  intm: {
    base: `Inter, sans-serif;`,
    full: `Inter, sans-serif;`,
  },
  intsb: {
    base: `Inter, sans-serif;`,
    full: `Inter, sans-serif;`,
  },
  intb: {
    base: `Inter, sans-serif;`,
    full: `Inter, sans-serif;`,
  },
  wb: {
    base: `'Wellcome Bold Web Subset', 'Arial Black', sans-serif;`,
    full: `'Wellcome Bold Web', 'Wellcome Bold Web Subset', 'Arial Black', sans-serif;`,
  },
  lr: {
    base: `'Courier New', Courier, Monospace;`,
    full: `'Lettera Regular Web', 'Courier New', Courier, Monospace;`,
  },
};

const fontSizeMixin = size => {
  return breakpointNames
    .map(name => {
      return `@media (min-width: ${themeValues.sizes[name]}px) {
      font-size: ${fontSizesAtBreakpoints[name][size]}rem;
    }`;
    })
    .join(' ');
};

type FontFamily = keyof typeof fontFamilies;

export const fontFamilyMixin = (
  family: FontFamily,
  isFull: boolean
): string => {
  return `font-family: ${fontFamilies[family][isFull ? 'full' : 'base']}`;
};

export const typography = css<GlobalStyleProps>`
  .font-intb {
    font-weight: 700;
  }

  .font-intsb {
    font-weight: 600;
  }

  .font-intm {
    font-weight: 500;
  }

  .font-intr {
    font-weight: 400;
  }

  ${props => `
    .font-intb {
      ${fontFamilyMixin('intb', !!props.isFontsLoaded)};
    }

    .font-intsb {
      ${fontFamilyMixin('intsb', !!props.isFontsLoaded)};
    }

    .font-intm {
      ${fontFamilyMixin('intm', !!props.isFontsLoaded)};
    }

    .font-intr {
      ${fontFamilyMixin('intr', !!props.isFontsLoaded)};
    }

    .font-wb {
      ${fontFamilyMixin('wb', !!props.isFontsLoaded)};
    }

    .font-lr {
      ${fontFamilyMixin('lr', !!props.isFontsLoaded)};
    }
  `}

  html {
    font-size: 100%;
  }

  body {
    ${fontFamilyMixin('intr', true)}
    ${fontSizeMixin(4)}
    line-height: 1.5;
    color: ${themeValues.color('black')};
    font-variant-ligatures: no-common-ligatures;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -o-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1em;
    margin: 0 0 0.6em;
  }

  /*
  OnThisPageAnchors.sticky relies on sections with data-id attributes
  and we want to adjust the scroll margin for headings within those sections
  */
  [data-id] :is(h2, h3) {
    /* Enough space to clear the sticky header */
    scroll-margin-top: 3rem;

    @media (min-width: ${themeValues.sizes.large}px) {
      /* Align the top of the heading with the top of the side navigation */
      scroll-margin-top: ${themeValues.spaceAtBreakpoints.large.l}px;
    }
  }

  a {
    color: inherit;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  p {
    margin-top: 0;
    margin-bottom: 1.6em;

    &:empty {
      display: none;
    }
  }

  hr {
    margin: 0;
  }

  .more-link {
    color: ${themeValues.color('accent.green')};
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  .spaced-text {
    p,
    ul,
    h2,
    h3 {
      margin-bottom: 0;
    }

    /*
    * + * operates on elements inside 'spaced-text' that have a previous sibling, which is what we want _most_ of the time for content from the CMS. Occassionally we'll need to override this to prevent excess space being added where we need slightly more complicated markup. In these cases we can add 'spaced-text-reset' to the elements that shouldn't have extra margin.
    */

    * + *:not(.spaced-text-reset) {
      margin-top: ${themeValues.spacedTextTopMargin};
    }

    li + li {
      margin-top: 0.3em;
    }

    h2 + p,
    h2 + ul {
      margin-top: 1.2em;
    }

    h3 + p,
    h3 + ul {
      margin-top: 0.3em;
    }
  }

  .body-text {
    line-height: 1.6;
    letter-spacing: 0.0044em;

    h1 {
      ${fontFamilyMixin('wb', true)}
      ${fontSizeMixin(1)}
    }

    h2 {
      ${fontFamilyMixin('wb', true)}
      ${fontSizeMixin(2)}
    }

    /* Visual stories have their own h2 styling that involves more space and a border above */
    .content-type-visual-story & h2 {
      padding-top: 2em;
      margin-top: 1.5em;
      border-top: 1px solid ${props => props.theme.color('black')};
    }

    .content-type-visual-story &.first-text-slice h2:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    h3 {
      ${fontFamilyMixin('intb', true)}
      ${fontSizeMixin(3)}
    }

    *::selection {
      background: ${themeValues.color('accent.turquoise')}4d;
    }

    /* stylelint-disable no-descending-specificity */
    ul {
      list-style: none;
      padding: 0;

      li {
        padding-left: 12px;

        &::before {
          content: '';
          width: 0.35em;
          height: 0.35em;
          display: inline-block;
          vertical-align: middle;
          border-radius: 0.1em;
          background: currentColor;
          margin-right: 6px;
          margin-left: -12px;
        }
      }
    }
    /* stylelint-enable no-descending-specificity */

    a:link:not(.link-reset),
    a:visited:not(.link-reset) {
      text-decoration: underline;
      text-underline-offset: 0.1em;
      transition: color ${themeValues.transitionProperties};

      &:hover {
        color: ${themeValues.color('accent.green')};
        text-decoration-color: transparent;
      }
    }

    strong,
    b {
      ${fontFamilyMixin('intb', true)};
    }
  }

  .drop-cap {
    ${fontFamilyMixin('wb', true)}
    font-size: 3em;
    color: ${themeValues.color('black')};
    float: left;
    line-height: 1em;
    padding-right: 0.1em;
    position: relative;
    top: 0.05em;
  }

  /* stylelint-disable no-descending-specificity */
  .quote {
    border-left: 12px solid ${themeValues.color('warmNeutral.400')};
    padding-left: 0.9em;

    p {
      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  /* stylelint-enable no-descending-specificity */

  .quote--pull {
    border-color: transparent;
    position: relative;

    &::before {
      ${fontFamilyMixin('wb', true)}
      position: absolute;
      content: '“';
      color: ${themeValues.color('accent.blue')};
      left: -14px;
      top: 0.12em;
      font-size: 2em;
      line-height: 1;
    }
  }

  .quote__cite {
    font-style: normal;
  }
`;

export function makeFontSizeClasses(): string {
  return breakpointNames
    .map(bp => {
      return `@media (min-width: ${themeValues.sizes[bp]}px) {
      ${Object.entries(fontSizesAtBreakpoints[bp])
        .map(([key, value]) => {
          return `.font-size-${key} {font-size: ${value}rem}`;
        })
        .join(' ')}
    }`;
    })
    .join(' ');
}

function overridesAtBreakpoint(bp: string) {
  return Object.entries(fontSizeUnits)
    .map(([key, value]) => {
      return `.font-size-override-${bp}-${key} {font-size: ${value}rem}`;
    })
    .join(' ');
}

export function makeFontSizeOverrideClasses(): string {
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
