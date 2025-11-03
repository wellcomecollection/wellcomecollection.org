import { css } from 'styled-components';

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

  * {
    &:focus-visible,
    &:focus {
      box-shadow: ${props => props.theme.focusBoxShadow};
      outline: ${props => props.theme.highContrastOutlineFix};
    }

    :focus:not(:focus-visible) {
      box-shadow: none;
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
