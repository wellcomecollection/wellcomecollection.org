import { themeValues } from '@weco/common/views/themes/config';

export const gridScroll = `
.grid__scroll-container,
.grid__cell.grid__scroll-container {
  ${themeValues.mediaBetween(
    'small',
    'medium'
  )(`
      overflow: auto;
      margin-left: -${themeValues.containerPadding.small}px;
      padding-left: ${themeValues.containerPadding.small}px;
      margin-right: -${themeValues.containerPadding.small}px;
      padding-bottom: ${themeValues.containerPadding.large}px;
  `)}
}

.grid--scroll,
.grid.grid--scroll {
  ${themeValues.mediaBetween(
    'small',
    'medium'
  )(`
    margin-left: 0;
    display: flex;
    flex-wrap: nowrap;
    padding-left: ${themeValues.containerPadding.small}px;
    padding-right: ${themeValues.containerPadding.small}px;

    .grid__cell,
    .grid__cell {
      flex: 1;
      min-width: 75vw;
      padding-left: 0;
      padding-right: ${themeValues.gutter.small}px;
    }
  `)}
}

.grid.grid--scroll {
  padding: 0;
}`;
