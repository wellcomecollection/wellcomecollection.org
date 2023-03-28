import { css } from 'styled-components';
import { GlobalStyleProps } from './default';

export const utilityClasses = css<GlobalStyleProps>`
  .is-hidden {
    display: none !important;
  }

  .is-hidden-s {
    ${props =>
      props.theme.mediaBetween(
        'small',
        'medium'
      )(`
        display: none !important;
    `)}
  }

  .is-hidden-m {
    ${props =>
      props.theme.mediaBetween(
        'medium',
        'large'
      )(`
        display: none !important;
    `)}
  }

  .is-hidden-l {
    ${props =>
      props.theme.mediaBetween(
        'large',
        'xlarge'
      )(`
        display: none !important;
    `)}
  }

  .is-hidden-xl {
    ${props => props.theme.media('xlarge')`
      display: none !important;
    `}
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

  .flex--wrap {
    flex-wrap: wrap;
  }

  .flex--h-center {
    justify-content: center;
  }

  .flex--h-space-between {
    justify-content: space-between;
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

  .no-visible-focus {
    &,
    &:focus {
      outline: 0;
    }
  }

  .inline {
    display: inline;
  }

  .no-margin {
    margin: 0 !important;
  }

  .promo-link {
    height: 100%;
    color: ${props => props.theme.color('black')};

    &:hover .promo-link__title,
    &:focus .promo-link__title {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('black')};
    }
  }

  .promo-link__title {
    transition: color 400ms ease;
  }

  .rounded-diagonal {
    border-top-left-radius: ${props => props.theme.borderRadiusUnit}px;
    border-bottom-right-radius: ${props => props.theme.borderRadiusUnit}px;
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
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
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
        text-decoration-color: ${props => props.theme.color('black')};
      }
    }
  }

  .shadow {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
  }

  noscript {
    background: ${props => props.theme.color('white')};
    color: ${props => props.theme.color('black')};
  }
`;
