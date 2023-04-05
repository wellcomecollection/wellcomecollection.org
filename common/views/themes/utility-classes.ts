import { css } from 'styled-components';
import { GlobalStyleProps } from './default';

export const utilityClasses = css<GlobalStyleProps>`
  // Keep using
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

  // Stop using and clean up where it is used, eventually delete these.
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

  .inline {
    display: inline;
  }

  .relative {
    position: relative;
  }

  // Set to button element as default styles
  // Check if anything that uses this class should be using ButtonSolid instead
  // Check if any button styles can be cleaned up as this is now the default
  // Delete this class declaration
  .plain-button {
    appearance: none;
    font-family: inherit;
    letter-spacing: inherit;
    background: transparent;
    border: 0;
    text-align: left;
  }

  // Design review? This is used in footer and cards
  // We want default text links to be underlined
  // Add comment to explain when this should be used.
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

  // rename this one or delete it?
  .hidden {
    visibility: hidden;
  }

  .no-visible-focus {
    &,
    &:focus {
      outline: 0;
    }
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

  .full-width {
    width: 100%;
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
