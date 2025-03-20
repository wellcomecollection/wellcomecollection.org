import styled, { DefaultTheme } from 'styled-components';

import { ColumnKey } from '@weco/common/views/themes/config';
import { gridCells } from '@weco/common/views/themes/mixins';

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

      return null;
    })
    .join(' ');

  return columnString;
}

function maxWidthGridFallback(theme: DefaultTheme) {
  return `
    margin-left: auto;
    margin-right: auto;

    ${Object.entries(theme.grid)
      .map(entry => {
        const value = entry[1];
        const respondValue =
          value.respond[0] === 'xlarge'
            ? `max-width: ${theme.sizes.xlarge - value.padding * 2}px`
            : `max-width: calc(100% - ${value.padding * 2}px)`;

        return theme.media(value.respond[0])(respondValue);
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
  display: grid;
  grid-auto-rows: minmax(min-content, max-content);

  ${props =>
    Object.entries(props.theme.grid)
      .map(entry => {
        const value = entry[1];
        const { respond, padding } = value;
        const columns = [
          `[full-start] minmax(${padding}px, 1fr)`,
          `[main-start] minmax(0, ${props.theme.sizes.xlarge - padding * 2}px)`,
          `[main-end] minmax(${padding}px, 1fr)`,
          `[full-end]`,
        ].join(' ');

        return props.theme.media(respond[0])(
          `grid-template-columns: ${columns}`
        );
      })
      .join(' ')}

  .grid__cell--main {
    ${props => maxWidthGridFallback(props.theme)};
    grid-column: main;
  }

  .grid__cell--full {
    grid-column: full;
  }

  .grid {
    ${props => maxWidthGridFallback(props.theme)};
    position: relative;
    grid-column: main;
    grid-auto-rows: minmax(0, auto);
    display: grid;

    ${props =>
      Object.entries(props.theme.grid)
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
          return props.theme.media(respond[0])(`
              grid-column-gap: ${gutter}px;
              grid-row-gap: ${gutter}px;
              grid-template-columns: ${makeGridTemplateColumns(
                primaryStart,
                primaryEnd,
                secondaryStart,
                secondaryEnd,
                columns
              )};
            `);
        })
        .join(' ')}
  }

  .grid__cell,
  .grid__cell--primary,
  .grid__cell--secondary {
    .grid__cell {
      margin-bottom: 0 !important;
    }

    position: static;
    padding: 0;
  }

  .grid__cell--primary {
    grid-column: primary;
    max-width: none;
  }

  .grid__cell--secondary {
    grid-column: secondary;
    max-width: none;
  }

  ${props =>
    Object.entries(props.theme.grid).map(([key, { columns, respond }]) => {
      if (respond.length > 1) {
        return props.theme.mediaBetween(
          respond[0],
          respond[1]
        )(gridCells(columns, key as ColumnKey));
      } else {
        return props.theme.media(respond[0])(
          gridCells(columns, key as ColumnKey)
        );
      }
    })}
`;

export default CssGridContainer;
