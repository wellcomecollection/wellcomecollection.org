import {
  theme as designSystemTheme,
  SizeVariants,
  TypographySizeKey,
  TypographyValue,
} from '@wellcometrust/wellcome-design-system/theme';
import { css } from 'styled-components';

// Note: the design system font sizing uses vw units and clamp so that there is
// a gradated change across viewport widths without a need for breakpoint changes.
// We have considered the utility of a similar container query based approach using
// cqi units instead of vw, but concluded that for the time-being the vw version
// is serving our needs adequately. We should revisit the idea of a container query
// version if we encounter a situation where it would be clearly beneficial
// https://github.com/wellcomecollection/wellcomecollection.org/issues/12324

export const bodyStrongFontWeight =
  designSystemTheme.typography.body.strong?.lg?.fontWeight;

export const compositeTypographyMixin = (
  category: 'body' | 'caption' | 'display' | 'label' | 'heading',
  size: TypographySizeKey,
  weight: 'regular' | 'strong',
  family?: 'sans' | 'brand'
) => {
  const t = designSystemTheme.typography;
  const weights: Partial<Record<'regular' | 'strong', SizeVariants>> =
    category === 'heading'
      ? t.heading[family ?? 'sans']
      : category === 'body'
        ? t.body
        : category === 'display'
          ? t.display
          : category === 'caption'
            ? t.caption
            : t.label;
  const style = weights[weight]?.[size];

  if (!style) return css``;

  return css`
    font-family: ${style.fontFamily};
    font-weight: ${style.fontWeight};
    font-size: ${style.fontSize};
    line-height: ${style.lineHeight};
    letter-spacing: ${style.letterSpacing};
  `;
};

export const typography = css`
  html {
    font-size: 100%;
  }

  body {
    ${compositeTypographyMixin('body', 'lg', 'regular')}
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
  InPageNavigation relies on sections with data-id attributes
  and we want to adjust the scroll margin for headings within those sections
  */
  :has([data-in-page-navigation]) :is(h2, h3) {
    /* Enough space to clear the sticky header */
    scroll-margin-top: 3rem;

    @media (min-width: ${props => props.theme.sizes.md}) {
      /* Align the top of the heading with the top of the side navigation */
      scroll-margin-top: ${props => props.theme.getSpaceValue('md', 'md')};
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
    h1 {
      ${compositeTypographyMixin('heading', 'xxl', 'strong', 'brand')}
    }

    h2 {
      ${compositeTypographyMixin('heading', 'xl', 'strong', 'brand')}
    }

    h3 {
      ${compositeTypographyMixin('body', 'xl', 'strong')}
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
      font-weight: ${designSystemTheme.typography.body.strong?.lg?.fontWeight};
    }
  }

  .drop-cap {
    ${compositeTypographyMixin('heading', 'xl', 'strong', 'brand')}
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
      ${compositeTypographyMixin('heading', 'xl', 'strong', 'brand')}
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

export const makeFontSizeClasses = () => css`
  ${Object.entries(designSystemTheme.font.size)
    .map(([key, value]) => {
      return `.font-size-${key} {font-size: ${value}}`;
    })
    .join(' ')}
`;

export const makeCompositeTypographyClasses = () => {
  const t = designSystemTheme.typography;
  const sizes: TypographySizeKey[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

  const toDeclarations = ({
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    letterSpacing,
  }: TypographyValue) =>
    `font-family: ${fontFamily}; font-weight: ${fontWeight}; font-size: ${fontSize}; line-height: ${lineHeight}; letter-spacing: ${letterSpacing};`;

  const buildClasses = (
    category: string,
    weights: Partial<Record<'regular' | 'strong', SizeVariants>>,
    family?: string
  ): string[] =>
    (Object.entries(weights) as [string, SizeVariants | undefined][]).flatMap(
      ([weight, sizeVariants]) =>
        sizes.flatMap(size => {
          const style = sizeVariants?.[size];
          if (!style) return [];
          const className = family
            ? `.type-${category}-${size}-${weight}-${family}`
            : `.type-${category}-${size}-${weight}`;
          return [`${className} { ${toDeclarations(style)} }`];
        })
    );

  return css`
    ${[
      ...buildClasses('body', t.body),
      ...buildClasses('display', t.display),
      ...buildClasses('caption', t.caption),
      ...buildClasses('label', t.label),
      ...buildClasses('heading', t.heading.sans, 'sans'),
      ...buildClasses('heading', t.heading.brand, 'brand'),
    ].join(' ')}
  `;
};
