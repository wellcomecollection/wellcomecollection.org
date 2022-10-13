import { respondBetween } from '../mixins';

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
  ${respondBetween(
    'small',
    'medium',
    `
  margin: 0;
    height: 100vh;
    overflow: hidden;

  `
  )}
}
`;
