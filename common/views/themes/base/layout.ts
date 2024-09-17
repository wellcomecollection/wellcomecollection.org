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
  body:has(dialog[open]) {
    margin: 0;
    height: 100vh;
    overflow: hidden;
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
