import { ColumnKey } from './config';

export function gridCells(columns: number, key: ColumnKey): string {
  return [...Array(columns).keys()]
    .map(c => {
      const col = c + 1;
      return `
      .grid__cell--${key}${col} {
        flex-basis: ${(col / columns) * 100}%;
        max-width: ${(col / columns) * 100}%;
      }

      .grid__cell--shift-${key}${col} {
        margin-left: ${(col / columns) * 100}%;
      }
    `;
    })
    .join(' ');
}

export function cssGridCells(columns: number, key: ColumnKey): string {
  return [...Array(columns).keys()]
    .map(c => {
      const col = c + 1;

      return `
      .css-grid__cell--${key}${col} {
        flex-basis: ${(col / columns) * 100}%;
        max-width: ${(col / columns) * 100}%;

        @supports(display: grid) {
          max-width: none;
          grid-column: span ${col};
        }
      }
    `;
    })
    .join(' ');
}
