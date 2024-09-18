import styled, { DefaultTheme } from 'styled-components';

import { ColumnKey } from '@weco/common/views/themes/config';

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
  @supports (display: grid) {
    display: grid;
    grid-auto-rows: minmax(min-content, max-content);

    ${props =>
      Object.entries(props.theme.grid)
        .map(entry => {
          const value = entry[1];
          const { respond, padding } = value;
          const columns = [
            `[full-start] minmax(${padding}px, 1fr)`,
            `[main-start] minmax(0, ${
              props.theme.sizes.xlarge - padding * 2
            }px)`,
            `[main-end] minmax(${padding}px, 1fr)`,
            `[full-end]`,
          ].join(' ');

          return props.theme.media(respond[0])(
            `grid-template-columns: ${columns}`
          );
        })
        .join(' ')}
  }

  .css-grid__cell--main {
    ${props => maxWidthGridFallback(props.theme)};
    grid-column: main;
  }

  .css-grid__cell--full {
    grid-column: full;
  }

  .css-grid {
    ${props => maxWidthGridFallback(props.theme)};
    display: flex;
    flex-wrap: wrap;

    @supports (display: grid) {
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
  }

  .css-grid__cell,
  .css-grid__cell--primary,
  .css-grid__cell--secondary {
    /* fallback */
    flex: 1;
    position: relative;

    ${props => `
      padding-left: ${props.theme.gutter.small}px;
      padding-bottom: ${props.theme.gutter.small}px;
      left: -${props.theme.gutter.small}px;

      ${props.theme.media('medium')(`
        padding-left: ${props.theme.gutter.medium}px;
        padding-bottom: ${props.theme.gutter.medium}px;
        left: -${props.theme.gutter.medium}px;
      `)}

      ${props.theme.media('large')(`
        padding-left: ${props.theme.gutter.large}px;
        padding-bottom: ${props.theme.gutter.large}px;
        left: -${props.theme.gutter.large}px;
      `)}
    `}

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

    ${props =>
      props.theme.media('large')(`
      flex-basis: ${(7 / 12) * 100}%;
      max-width: ${(7 / 12) * 100}%;
    `)}

    @supports (display: grid) {
      max-width: none;
    }
  }

  .css-grid__cell--secondary {
    grid-column: secondary;

    ${props =>
      props.theme.media('large')(`
        order: 1;
        flex-basis: ${(5 / 12) * 100}%;
        max-width: ${(5 / 12) * 100}%;
    `)}

    @supports (display: grid) {
      max-width: none;
    }
  }

  ${props =>
    Object.entries(props.theme.grid).map(([key, { columns, respond }]) => {
      if (respond.length > 1) {
        return props.theme.mediaBetween(
          respond[0],
          respond[1]
        )(makeGridCells(columns, key as ColumnKey));
      } else {
        return props.theme.media(respond[0])(
          makeGridCells(columns, key as ColumnKey)
        );
      }
    })}
`;

export default CssGridContainer;
