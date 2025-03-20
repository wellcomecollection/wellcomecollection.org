import { themeValues } from '@weco/common/views/themes/config';

export const gridBase = `
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${themeValues.gutter.small}px;

  ${themeValues.media('medium')(`
    gap: ${themeValues.gutter.medium}px;
  `)}

  ${themeValues.media('large')(`
    gap: ${themeValues.gutter.large}px;
  `)}
}`;
