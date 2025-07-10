import { themeValues } from '@weco/common/views/themes/config';

export const layout = `
* {
  &,
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

.is-scroll-locked {
  margin: 0;
  height: 100vh;
  overflow: hidden;
}

@supports selector(:has(a)) {
  body:has(dialog[open]),
  body:has([data-lock-scroll="true"]) {
    margin: 0;
    height: 100vh;
    overflow: hidden;
  }

  html:has([data-scroll-smooth="true"]):not(:has([data-lock-scroll="true"])) {
    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }
}




.is-scroll-locked--to-medium {
  ${themeValues.mediaBetween(
    'small',
    'medium'
  )(`
      margin: 0;
      height: 100vh;
      overflow: hidden;
  `)}
}
`;
