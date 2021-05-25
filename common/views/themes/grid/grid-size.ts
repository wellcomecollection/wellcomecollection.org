import { gridCells, respondTo, respondBetween } from '../mixins';
import { themeValues, ColumnKey } from '../config';

export const gridSize = `
  ${Object.entries(themeValues.grid)
    .map(([bp, { columns, respond }]) => {
      return respond.length > 1
        ? respondBetween(
            respond[0],
            respond[1],
            gridCells(columns, bp as ColumnKey)
          )
        : respondTo(respond[0], gridCells(columns, bp as ColumnKey));
    })
    .join(' ')}
`;
