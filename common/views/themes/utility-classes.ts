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

  // Only hides when printing
  .is-hidden-print {
    @media print {
      display: none;
    }
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
`;
