import { themeValues } from '@weco/common/views/themes/config';

export const gridTheme = `
.grid__cell {
  [class*='grid--theme-'] & {
    flex-basis: 100%;
  }

  .grid--theme-4 & {
    ${themeValues.media('medium')`
      flex-basis: 50%;
      max-width: 50%;
    `}

    ${themeValues.media('xlarge')`
      flex-basis: 25%;
      max-width: 25%;
    `}
  }
}`;
