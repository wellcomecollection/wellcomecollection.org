import { themeValues } from './config';
import { css } from 'styled-components';
import { GlobalStyleProps } from './default';
import { respondTo, respondBetween, visuallyHidden } from './mixins';

export const utilityClasses = css<GlobalStyleProps>`
  ${Object.entries(themeValues.colors)
    .map(([key, value]) => {
      if (!key.includes('.')) {
        return `
        .font-${key} {
          color: ${value};
        }`;
      } else {
        const colorName = key.split('.');
        return `
        .font-${colorName[0]}-${colorName[1]} {
          color: ${value};
        }`;
      }
    })
    .join(' ')}

  .transition-bg {
    transition: background ${themeValues.transitionProperties};
  }

  .is-hidden {
    display: none !important;
  }

  .is-hidden-s {
    ${respondBetween(
      'small',
      'medium',
      `
    display: none !important;
  `
    )}
  }

  .is-hidden-m {
    ${respondBetween(
      'medium',
      'large',
      `
    display: none !important;
  `
    )}
  }

  .is-hidden-l {
    ${respondBetween(
      'large',
      'xlarge',
      `
    display: none !important;
  `
    )}
  }

  .is-hidden-xl {
    ${respondTo(
      'xlarge',
      `
    display: none !important;
  `
    )}
  }

  .touch-scroll {
    -webkit-overflow-scrolling: touch;
  }

  .flex {
    display: flex;
  }

  .flex-inline {
    display: inline-flex;
  }

  .flex--v-center {
    align-items: center;
  }

  .flex--h-baseline {
    align-items: baseline;
  }

  .flex--wrap {
    flex-wrap: wrap;
  }

  .flex--h-center {
    justify-content: center;
  }

  .flex--h-space-between {
    justify-content: space-between;
  }

  .flex-end {
    justify-content: flex-end;
  }

  .flex-1 {
    flex: 1;
  }

  .plain-button {
    appearance: none;
    font-family: inherit;
    letter-spacing: inherit;
    background: transparent;
    border: 0;
    text-align: left;
  }

  .plain-link,
  .plain-link:link,
  .plain-link:visited {
    text-decoration: none;
    border: none;

    .body-text & {
      text-decoration: none;
      border: none;
    }
  }

  .underline-on-hover:hover,
  :link:hover .underline-on-hover {
    text-decoration: underline;
  }

  .text-align-center {
    text-align: center;
  }

  .no-visible-focus {
    &,
    &:focus {
      outline: 0;
    }
  }

  .plain-list {
    list-style: none;
  }

  .block {
    display: block;
  }

  .flex-ie-block {
    display: block; // IE

    @supports (display: flex) {
      // IE ignores @supports
      display: flex;
    }
  }

  .inline {
    display: inline;
  }

  .inline-block {
    display: inline-block;
  }

  .h-center {
    margin-left: auto;
    margin-right: auto;
  }

  .no-margin {
    margin: 0 !important;
  }

  .no-margin-s.no-margin-s {
    ${respondBetween(
      'small',
      'medium',
      `
    margin: 0;
  `
    )}
  }

  .no-margin-m.no-margin-m {
    ${respondBetween(
      'medium',
      'large',
      `
    margin: 0;
  `
    )}
  }

  .no-margin-l.no-margin-l {
    ${respondTo(
      'large',
      `
    margin: 0;
  `
    )}
  }

  .no-padding {
    padding: 0;
  }

  .promo-link {
    height: 100%;
    color: ${themeValues.color('black')};

    &:hover .promo-link__title,
    &:focus .promo-link__title {
      text-decoration: underline;
      text-decoration-color: ${themeValues.color('black')};
    }
  }

  .promo-link__title {
    transition: color 400ms ease;
  }

  .rounded-corners {
    border-radius: ${themeValues.borderRadiusUnit}px;
  }

  .rounded-diagonal {
    border-top-left-radius: ${themeValues.borderRadiusUnit}px;
    border-bottom-right-radius: ${themeValues.borderRadiusUnit}px;
  }

  .round {
    border-radius: 50%;
  }

  .relative {
    position: relative;
  }

  .absolute {
    position: absolute;
  }

  .full-width {
    width: 100%;
  }

  // For when we get HTML out of systems like Prismic
  .first-para-no-margin p:first-of-type {
    margin: 0;
  }

  // This removes the element from the flow, as well as it's visibility
  .visually-hidden {
    ${visuallyHidden};
  }

  .visually-hidden-focusable {
    &:active,
    &:focus {
      clip: auto;
      height: auto;
      margin: 0;
      overflow: visible;
      position: static;
      width: auto;
      white-space: inherit;
    }
  }

  .hidden {
    visibility: hidden;
  }

  // TODO: use this for e.g. Promo hover behaviour too
  .card-link {
    text-decoration: none;

    &:hover,
    &:focus {
      .card-link__title {
        text-decoration: underline;
        text-decoration-color: ${themeValues.color('black')};
      }
    }
  }

  .empty-filler:before {
    content: '\\200b';
  }
  .shadow {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
  }

  noscript {
    background: ${themeValues.color('white')};
    color: ${themeValues.color('black')};
  }
`;
