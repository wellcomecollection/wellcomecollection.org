import { css } from 'styled-components';

export const focusStyle = css`
  outline: 0.3rem double ${props => props.theme.color('black')};
  box-shadow: 0 0 0 0.3rem ${props => props.theme.color('white')};
`;

export const wellcomeNormalize = css`
  input,
  button {
    border-radius: 0;
  }

  button {
    appearance: none;
    font-family: inherit;
    letter-spacing: inherit;
    background: transparent;
    border: 0;
    text-align: left;
    cursor: pointer;
  }

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }

  img {
    width: 100%;
    height: auto;
  }

  *,
  button {
    /* Firefox needs 'button' to override specific UA focus styles */
    &:focus-visible {
      ${focusStyle};
    }
  }

  .openseadragon-canvas:focus {
    border: 2px solid ${props => props.theme.color('focus.yellow')} !important;
  }

  /* TODO verify if this is used (maybe by a library?) */
  .scale {
    transform: scale(0);
    transition: transform 500ms;
  }

  .scale.scale-entered {
    transform: scale(1);
  }
`;
