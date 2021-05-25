import { respondTo } from '../mixins';

export const gridTheme = `
.grid__cell {
  [class*='grid--theme-'] & {
    flex-basis: 100%;
  }

  .grid--theme-4 & {
    ${respondTo(
      'medium',
      `
    flex-basis: 50%;
    max-width: 50%;
    `
    )}

    ${respondTo(
      'xlarge',
      `
    flex-basis: 25%;
    max-width: 25%;
    `
    )}
  }
}`;
