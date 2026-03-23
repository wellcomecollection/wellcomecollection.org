import { createGlobalStyle } from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${tokens.typography.fontFamily};
    color: ${tokens.colors.text.primary};
    background-color: ${tokens.colors.background.default};
    line-height: 1.5;
  }

  /* Accessible link styles */
  a {
    color: ${tokens.colors.info.main};
    text-decoration: underline;
    transition: color 150ms ease;
  }

  a:hover {
    color: ${tokens.colors.black};
  }

  a:active {
    color: ${tokens.colors.info.main};
  }

  /* Focus indicators for keyboard navigation */
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }

  /* Remove outline for mouse/pointer users */
  a:focus:not(:focus-visible),
  button:focus:not(:focus-visible),
  input:focus:not(:focus-visible),
  textarea:focus:not(:focus-visible),
  select:focus:not(:focus-visible) {
    outline: none;
  }

  /* Improve readability */
  h1, h2, h3, h4, h5, h6 {
    color: ${tokens.colors.text.primary};
    line-height: 1.2;
  }

`;

export default GlobalStyles;
