import { themeValues } from '@weco/common/views/themes/config';

export const gridTheme = `
.grid__cell {
  .grid--theme-4 & {
    ${themeValues.media('medium')`
      grid-column: span 6;
    `}

    ${themeValues.media('xlarge')`
      grid-column: span 3;
    `}
  }
}`;
