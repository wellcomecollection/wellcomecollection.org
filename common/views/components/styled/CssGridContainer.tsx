import styled from 'styled-components';
import { respondBetween, respondTo } from '../../themes/mixins';
import { ColumnKey, themeValues } from '../../themes/config';

function makeGridCells(columns: number, key: ColumnKey): string {
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
function makeGridTemplateColumns(
  primaryStart = 1,
  primaryEnd = 7,
  secondaryStart = 8,
  secondaryEnd = 12,
  columns = 12
): string {
  let columnString = ``;

  [...Array(columns).keys()]
    .map(c => {
      const col = c + 1;

      if (col === primaryStart && col === secondaryStart) {
        columnString = `${columnString} [primary-start secondary-start]`;
      } else if (col === primaryStart) {
        columnString = `${columnString} [primary-start]`;
      } else if (col === secondaryStart && primaryEnd === secondaryStart - 1) {
        columnString = `${columnString} [primary-end secondary-start]`;
      } else if (col === secondaryStart) {
        columnString = `${columnString} [secondary-start]`;
      }

      columnString = `${columnString} 1fr`;

      if (col === primaryEnd && col === secondaryEnd) {
        columnString = `${columnString} [primary-end secondary-end]`;
      } else if (col === primaryEnd && col !== secondaryStart - 1) {
        columnString = `${columnString} [primary-end]`;
      } else if (col === secondaryEnd) {
        columnString = `${columnString} [secondary-end]`;
      }
    })
    .join(' ');

  return columnString;
}

function maxWidthGridFallback() {
  return `
    margin-left: auto;
    margin-right: auto;

    ${Object.entries(themeValues.grid)
      .map(entry => {
        const value = entry[1];
        const respondValue =
          value.respond[0] === 'xlarge'
            ? `max-width: ${themeValues.sizes.xlarge - value.padding * 2}px`
            : `max-width: calc(100% - ${value.padding * 2}px)`;

        return respondTo(value.respond[0], respondValue);
      })
      .join(' ')}

    // we don't want to apply a max width to any nested container
    // since this is a mixin that can be applied in a couple of places
    // using ampersands to refer to the class in which it's used
    & & {
      max-width: none;
    }

    @supports (display: grid) {
      margin: 0;
      max-width: none;
    }`;
}

const CssGridContainer = styled.div`
  @supports (display: grid) {
    display: grid;
    grid-auto-rows: minmax(min-content, max-content);

    ${Object.entries(themeValues.grid)
      .map(entry => {
        const value = entry[1];
        const { respond, padding } = value;
        const columns = `[full-start] minmax(${padding}px, 1fr) [main-start] minmax(0, ${themeValues
          .sizes.xlarge -
          padding * 2}px) [main-end] minmax(${padding}px, 1fr) [full-end]`;

        return respondTo(respond[0], `grid-template-columns: ${columns}`);
      })
      .join(' ')}
  }

  .css-grid__cell--main {
    ${maxWidthGridFallback()};
    grid-column: main;
  }

  .css-grid__cell--full {
    grid-column: full;
  }

  .css-grid {
    ${maxWidthGridFallback()};
    display: flex;
    flex-wrap: wrap;

    @supports (display: grid) {
      position: relative;
      grid-column: main;
      grid-auto-rows: minmax(0, auto);
      display: grid;

      ${Object.entries(themeValues.grid)
        .map(entry => {
          const value = entry[1];
          const {
            respond,
            gutter,
            primaryStart,
            primaryEnd,
            secondaryStart,
            secondaryEnd,
            columns,
          } = value;
          return respondTo(
            respond[0],
            `
              grid-column-gap: ${gutter}px;
              grid-row-gap: ${gutter}px;
              grid-template-columns: ${makeGridTemplateColumns(
                primaryStart,
                primaryEnd,
                secondaryStart,
                secondaryEnd,
                columns
              )};
            `
          );
        })
        .join(' ')}
    }
  }

  .css-grid__cell,
  .css-grid__cell--primary,
  .css-grid__cell--secondary {
    // fallback
    flex: 1;
    position: relative;
    padding-left: ${themeValues.gutter.small}px;
    padding-bottom: ${themeValues.gutter.small}px;
    left: -${themeValues.gutter.small}px;

    ${respondTo(
      'medium',
      `
      padding-left: ${themeValues.gutter.medium}px;
      padding-bottom: ${themeValues.gutter.medium}px;
      left: -${themeValues.gutter.medium}px;
    `
    )}

    ${respondTo(
      'large',
      `
    padding-left: ${themeValues.gutter.large}px;
    padding-bottom: ${themeValues.gutter.large}px;
    left: -${themeValues.gutter.large}px;
    `
    )}

    .css-grid__cell {
      margin-bottom: 0 !important;
    }

    @supports (display: grid) {
      position: static;
      padding: 0;
    }
  }

  .css-grid__cell--primary {
    grid-column: primary;

    ${respondTo(
      'large',
      `
      flex-basis: ${(7 / 12) * 100}%;
      max-width: ${(7 / 12) * 100}%;
    `
    )}

    @supports (display: grid) {
      max-width: none;
    }
  }

  .css-grid__cell--secondary {
    grid-column: secondary;

    ${respondTo(
      'large',
      `
      order: 1;
      flex-basis: ${(5 / 12) * 100}%;
      max-width: ${(5 / 12) * 100}%;
    `
    )}

    @supports (display: grid) {
      max-width: none;
    }
  }

  ${Object.entries(themeValues.grid).map(([key, { columns, respond }]) => {
    if (respond.length > 1) {
      return respondBetween(
        respond[0],
        respond[1],
        makeGridCells(columns, key as ColumnKey)
      );
    } else {
      return respondTo(respond[0], makeGridCells(columns, key as ColumnKey));
    }
  })}
`;

export default CssGridContainer;
