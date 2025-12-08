import { theme as designSystemTheme } from '@wellcometrust/wellcome-design-system/theme';
import { css } from 'styled-components';

import { GlobalStyleProps } from './default';

// Note: the design system font sizing uses vw units and clamp so that there is
// a gradated change across viewport widths without a need for breakpoint changes.
// We have considered the utility of a similar container query based approach using
// cqi units instead of vw, but concluded that for the time-being the vw version
// is serving our needs adequately. We should revisit the idea of a container query
// version if we encounter a situation where it would be clearly beneficial
// https://github.com/wellcomecollection/wellcomecollection.org/issues/12324

const fontFamilies = {
  sans: designSystemTheme.font.family.sans,
  brand: designSystemTheme.font.family.brand,
  mono: designSystemTheme.font.family.mono,
};

const fontSizeMixin = (
  size: -2 | -1 | 0 | 1 | 2 | 4 | 5
) => css<GlobalStyleProps>`
  font-size: ${designSystemTheme.font.size[`f${size}`]};
`;
type FontFamily = keyof typeof fontFamilies;

export const fontFamilyMixin = (
  family: FontFamily,
  isBold?: boolean
): string => {
  return `
  font-family: ${fontFamilies[family]};
  font-weight: ${designSystemTheme.font.weight[isBold ? 'semibold' : 'regular']};
  `;
};

export const typography = css<GlobalStyleProps>`
  .font-sans-bold {
    ${fontFamilyMixin('sans', true)};
  }

  .font-sans {
    ${fontFamilyMixin('sans')};
  }

  .font-brand {
    ${fontFamilyMixin('brand')};
  }

  .font-mono {
    ${fontFamilyMixin('mono')};
  }

  html {
    font-size: 100%;
  }

  body {
    ${fontFamilyMixin('sans')}
    ${fontSizeMixin(0)}
    line-height: ${designSystemTheme['line-height'].lg};
    color: ${props => props.theme.color('black')};
    font-variant-ligatures: no-common-ligatures;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -o-font-smoothing: antialiased;
    text-wrap-style: pretty;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1em;
    margin: 0 0 0.6em;
    text-wrap-style: balance;
    line-height: ${designSystemTheme['line-height'].md};
  }

  /*
  InPageNavigation.Sticky relies on sections with data-id attributes
  and we want to adjust the scroll margin for headings within those sections
  */
  [data-id] :is(h2, h3) {
    /* Enough space to clear the sticky header */
    scroll-margin-top: 3rem;

    @media (min-width: ${props => props.theme.sizes.large}) {
      /* Align the top of the heading with the top of the side navigation */
      scroll-margin-top: ${props => props.theme.getSpaceValue('l', 'large')};
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
    color: ${props => props.theme.color('accent.green')};
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

    > * + * {
      margin-top: ${props => props.theme.spacedTextTopMargin};
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
    letter-spacing: 0.0044em;

    h1 {
      ${fontFamilyMixin('brand')}
      ${fontSizeMixin(4)}
    }

    h2 {
      ${fontFamilyMixin('brand')}
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
      ${fontFamilyMixin('sans', true)}
      ${fontSizeMixin(1)}
    }

    *::selection {
      background: ${props => props.theme.color('accent.turquoise')}4d;
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
      transition: color ${props => props.theme.transitionProperties};

      &:hover {
        color: ${props => props.theme.color('accent.green')};
        text-decoration-color: transparent;
      }
    }

    strong,
    b {
      ${fontFamilyMixin('sans', true)};
    }
  }

  .drop-cap {
    ${fontFamilyMixin('brand')}
    font-size: 3em;
    color: ${props => props.theme.color('black')};
    float: left;
    line-height: 1em;
    padding-right: 0.1em;
    position: relative;
    top: 0.05em;
  }

  /* stylelint-disable no-descending-specificity */
  .quote {
    border-left: 12px solid ${props => props.theme.color('warmNeutral.400')};
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
      ${fontFamilyMixin('brand')}
      position: absolute;
      content: '“';
      color: ${props => props.theme.color('accent.blue')};
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

export const makeFontSizeClasses = () => css<GlobalStyleProps>`
  ${Object.entries(designSystemTheme.font.size)
    .map(([key, value]) => {
      return `.font-size-${key} {font-size: ${value}}`;
    })
    .join(' ')}
`;
