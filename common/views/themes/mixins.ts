import { themeValues, ColumnKey, Breakpoint } from './config';

export function respondTo(breakpoint: Breakpoint, content: string): string {
  return `@media (min-width: ${themeValues.sizes[breakpoint]}px) {
   ${content}
 }`;
}

export function respondBetween(
  minBreakpoint: Breakpoint,
  maxBreakpoint: Breakpoint,
  content: string
): string {
  return `@media (min-width: ${
    themeValues.sizes[minBreakpoint]
  }px) and (max-width: ${themeValues.sizes[maxBreakpoint] - 1}px) {
    ${content}
  }`;
}

export const visuallyHidden = `
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`;

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
