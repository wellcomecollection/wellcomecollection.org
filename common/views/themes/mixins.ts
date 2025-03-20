import { ColumnKey } from './config';

export function gridCells(columns: number, key: ColumnKey): string {
  return [...Array(columns).keys()]
    .map(c => {
      const col = c + 1;
      return `
      .grid__cell--${key}${col} {
        grid-column: span ${col};
      }
    `;
    })
    .join(' ');
}
