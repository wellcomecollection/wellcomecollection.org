import { ColumnKey } from './config';

export function gridCells(columns: number, key: ColumnKey): string {
  return [...Array(columns).keys()]
    .map(c => {
      const col = c + 1;
      return `
      .grid__cell--${key}${col} {
        grid-column: span ${col};

        &.grid__cell--shift-${key}1 {
          grid-column: 2 / span ${col};
        }

        &.grid__cell--shift-${key}2 {
          grid-column: 3 / span ${col};
        }
      }
    `;
    })
    .join(' ');
}
