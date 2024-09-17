import { themeValues } from '@weco/common/views/themes/config';

export const gridBase = `
.grid {
  display: flex;
  flex-wrap: wrap;
  margin-left: -${themeValues.gutter.small}px;

  ${themeValues.media('medium')(`
    margin-left: -${themeValues.gutter.medium}px;
  `)}

  ${themeValues.media('large')(`
    margin-left: -${themeValues.gutter.large}px;
  `)}
}

.grid__cell {
  flex: 1;
  padding-left: ${themeValues.gutter.small}px;

  ${themeValues.media('medium')(`
    padding-left: ${themeValues.gutter.medium}px;
  `)}

  ${themeValues.media('large')(`
    padding-left: ${themeValues.gutter.large}px;
  `)}
}`;
