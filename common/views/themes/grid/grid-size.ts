import { ColumnKey, themeValues } from '@weco/common/views/themes/config';
import { gridCells } from '@weco/common/views/themes/mixins';

export const gridSize = `
  ${Object.entries(themeValues.grid)
    .map(([bp, { columns, respond }]) => {
      return respond.length > 1
        ? themeValues.mediaBetween(
            respond[0],
            respond[1]
          )(gridCells(columns, bp as ColumnKey))
        : themeValues.media(respond[0])(gridCells(columns, bp as ColumnKey));
    })
    .join(' ')}
`;
