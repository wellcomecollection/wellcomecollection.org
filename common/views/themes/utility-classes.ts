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

  // This removes the element from the flow, as well as its visibility
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

  // Only used in one component so move there and delete this.
  // Question the style itself, is it something we still want as input and buttons went fully square?
  .rounded-diagonal {
    border-top-left-radius: ${props => props.theme.borderRadiusUnit}px;
    border-bottom-right-radius: ${props => props.theme.borderRadiusUnit}px;
  }

  // TODO See ticket for more information: https://github.com/wellcomecollection/wellcomecollection.org/issues/9541
  .plain-button {
    appearance: none;
    font-family: inherit;
    letter-spacing: inherit;
    background: transparent;
    border: 0;
    text-align: left;
  }

  // TODO See ticket for more information: https://github.com/wellcomecollection/wellcomecollection.org/issues/9557
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

  // TODO See ticket for more information: https://github.com/wellcomecollection/wellcomecollection.org/issues/9558
  .no-visible-focus {
    &,
    &:focus {
      outline: 0;
    }
  }

  // TODO See ticket for more information: https://github.com/wellcomecollection/wellcomecollection.org/issues/9561
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

  // TODO See ticket for more information: https://github.com/wellcomecollection/wellcomecollection.org/issues/9559
  noscript {
    background: ${props => props.theme.color('white')};
    color: ${props => props.theme.color('black')};
  }
`;
