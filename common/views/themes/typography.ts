import { themeValues } from './config';

const breakpointNames = ['small', 'medium', 'large'];

const fontSizeUnits = {
  '1': 14,
  '2': 15,
  '3': 16,
  '4': 18,
  '5': 20,
  '6': 22,
  '7': 24,
  '8': 28,
  '9': 32,
  '10': 40,
  '11': 50,
};

export const fontSizesAtBreakpoints = {
  small: {
    0: fontSizeUnits[9],
    1: fontSizeUnits[8],
    2: fontSizeUnits[7],
    3: fontSizeUnits[6],
    4: fontSizeUnits[3],
    5: fontSizeUnits[2],
    6: fontSizeUnits[1],
  },
  medium: {
    0: fontSizeUnits[10],
    1: fontSizeUnits[9],
    2: fontSizeUnits[8],
    3: fontSizeUnits[6],
    4: fontSizeUnits[4],
    5: fontSizeUnits[2],
    6: fontSizeUnits[1],
  },
  large: {
    0: fontSizeUnits[11],
    1: fontSizeUnits[10],
    2: fontSizeUnits[9],
    3: fontSizeUnits[7],
    4: fontSizeUnits[5],
    5: fontSizeUnits[3],
    6: fontSizeUnits[1],
  },
};

const fontFamilies = {
  hnm: {
    base: `'HelveticaNeue-Medium', 'Helvetica Neue Medium', 'Arial Black', sans-serif;`,
    full: `'Helvetica Neue Medium Web', 'HelveticaNeue-Medium', 'Helvetica Neue Medium', 'Arial Black', sans-serif;`,
  },
  hnl: {
    base: `'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, sans-serif;`,
    full: `'Helvetica Neue Light Web', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, sans-serif;`,
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
      font-size: ${fontSizesAtBreakpoints[name][size]}px;
    }`;
    })
    .join(' ');
};

const fontFamilyMixin = (family, isFull) => {
  return `font-family: ${fontFamilies[family][isFull ? 'full' : 'base']}`;
};

export const typography = `
  .font-hnm,
  .font-hnl {
    font-weight: normal;
  }

  .font-hnm {
    ${fontFamilyMixin('hnm', false)};

    .fonts-loaded & {
      ${fontFamilyMixin('hnm', true)};
    }
  }

  .font-hnl {
    ${fontFamilyMixin('hnl', false)};

    .fonts-loaded & {
      ${fontFamilyMixin('hnl', true)}
    }
  }

  .font-wb {
    ${fontFamilyMixin('wb', false)};

    .fonts-loaded & {
      ${fontFamilyMixin('wb', true)}
    }
  }

  .font-lr {
    ${fontFamilyMixin('lr', false)};

    .fonts-loaded & {
      ${fontFamilyMixin('lr', true)}
    }
  }

  html {
    font-size: 100%;
  }

  body {
    ${fontFamilyMixin('hnl', true)}
    ${fontSizeMixin(4)}
    line-height: 1.5;
    color: ${themeValues.color('black')};
    font-variant-ligatures: no-common-ligatures;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -o-font-smoothing: antialiased;
  }

  .h0 {
    ${fontFamilyMixin('wb', true)}
    ${fontSizeMixin(1)}
  }

  .h1 {
    ${fontFamilyMixin('wb', true)}
    ${fontSizeMixin(2)}
  }

  .h2 {
    ${fontFamilyMixin('wb', true)}
    ${fontSizeMixin(3)}
  }

  .h3 {
    ${fontFamilyMixin('wb', true)}
    ${fontSizeMixin(4)}
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1em;
    margin: 0 0 0.6em;
    font-weight: normal;
  }

  a {
    color: ${themeValues.color('inherit')};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }

    .is-keyboard & {
      &:focus {
        outline: 0;
        box-shadow: ${themeValues.focusBoxShadow};
      }
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
    color: ${themeValues.color('green')};
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

    * + * {
      margin-top: 1.55em;
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
      ${fontFamilyMixin('wb', true)}
      ${fontSizeMixin(2)}
    }

    h2 {
      ${fontFamilyMixin('wb', true)}
      ${fontSizeMixin(3)}
    }

    h3 {
      ${fontFamilyMixin('wb', true)}
      ${fontSizeMixin(4)}
    }

    *::selection {
      background: ${themeValues.color('turquoise')}4d;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding-left: 12px;

        &:before {
          content: '';
          width: 0.35em;
          height: 0.35em;
          display: inline-block;
          vertical-align: middle;
          border-radius: 0.1em;
          background: ${themeValues.color('currentColor')};
          margin-right: 6px;
          margin-left: -12px;
        }
      }
    }

    a:link:not(.link-reset),
    a:visited:not(.link-reset) {
      text-decoration: none;
      border-bottom: 2px solid ${themeValues.color('green')};
      transition: color ${themeValues.transitionProperties}, border-bottom ${
  themeValues.transitionProperties
};

      &:hover {
        color: ${themeValues.color('green')};
        border-bottom-color: ${themeValues.color('transparent')};
      }
    }

    strong,
    b {
      ${fontFamilyMixin('hnm', true)}
      font-weight: normal;
    }
  }

  // This is for when we receive content from a CMS,
  // making it easier to style the first node
  .first-para-bold p:first-of-type {
    ${fontFamilyMixin('hnm', true)}
    ${fontSizeMixin(4)}
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

  .quote {
    border-left: 12px solid ${themeValues.color('pumice')};
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

  .quote--pull {
    border-color: ${themeValues.color('transparent')};
    position: relative;

    &:before {
      ${fontFamilyMixin('wb', true)}
      position: absolute;
      content: '“';
      color: ${themeValues.color('teal')};
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
          return `.font-size-${key} {font-size: ${value}px}`;
        })
        .join(' ')}
    }`;
    })
    .join(' ');
}

function overridesAtBreakpoint(bp) {
  return Object.entries(fontSizeUnits)
    .map(([key, value]) => {
      return `.font-size-override-${bp}-${key} {font-size: ${value}px}`;
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
