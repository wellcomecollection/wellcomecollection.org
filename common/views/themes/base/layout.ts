import { themeValues } from '../config';

export const layout = `
* {
  &,
  &:before,
  &:after {
    box-sizing: border-box;
  }
}

body:has(dialog[open]),
.is-scroll-locked {
  margin: 0;
  height: 100vh;
  overflow: hidden;
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
