import styled from 'styled-components';

import { themeValues } from '@weco/common/views/themes/config';

type StartSpan = [span: number, start?: number];
export type SizeMap = Record<string, StartSpan>;

/* Global grid custom properties for calculating track widths */
const GlobalGridStyles = styled.div`
  /* Grid calculation custom properties */
  --grid-columns: 12;
  --grid-gaps: 11;

  /* Small breakpoint */
  --gap-size: ${themeValues.gutter.small}px;
  --one-column-width: calc(
    (100% - (var(--grid-gaps) * var(--gap-size))) / var(--grid-columns)
  );
  --two-column-width: calc((var(--one-column-width) * 2) + var(--gap-size));
  --three-column-width: calc(
    (var(--one-column-width) * 3) + (var(--gap-size) * 2)
  );
  --four-column-width: calc(
    (var(--one-column-width) * 4) + (var(--gap-size) * 3)
  );
  --five-column-width: calc(
    (var(--one-column-width) * 5) + (var(--gap-size) * 4)
  );
  --six-column-width: calc(
    (var(--one-column-width) * 6) + (var(--gap-size) * 5)
  );
  --seven-column-width: calc(
    (var(--one-column-width) * 7) + (var(--gap-size) * 6)
  );
  --eight-column-width: calc(
    (var(--one-column-width) * 8) + (var(--gap-size) * 7)
  );
  --nine-column-width: calc(
    (var(--one-column-width) * 9) + (var(--gap-size) * 8)
  );
  --ten-column-width: calc(
    (var(--one-column-width) * 10) + (var(--gap-size) * 9)
  );
  --eleven-column-width: calc(
    (var(--one-column-width) * 11) + (var(--gap-size) * 10)
  );
  --twelve-column-width: 100%;

  ${themeValues.media('medium')(`
    --gap-size: ${themeValues.gutter.medium}px;
    --one-column-width: calc((100% - (var(--grid-gaps) * var(--gap-size))) / var(--grid-columns));
    --two-column-width: calc((var(--one-column-width) * 2) + var(--gap-size));
    --three-column-width: calc((var(--one-column-width) * 3) + (var(--gap-size) * 2));
    --four-column-width: calc((var(--one-column-width) * 4) + (var(--gap-size) * 3));
    --five-column-width: calc((var(--one-column-width) * 5) + (var(--gap-size) * 4));
    --six-column-width: calc((var(--one-column-width) * 6) + (var(--gap-size) * 5));
    --seven-column-width: calc((var(--one-column-width) * 7) + (var(--gap-size) * 6));
    --eight-column-width: calc((var(--one-column-width) * 8) + (var(--gap-size) * 7));
    --nine-column-width: calc((var(--one-column-width) * 9) + (var(--gap-size) * 8));
    --ten-column-width: calc((var(--one-column-width) * 10) + (var(--gap-size) * 9));
    --eleven-column-width: calc((var(--one-column-width) * 11) + (var(--gap-size) * 10));
    --twelve-column-width: 100%;
  `)}

  ${themeValues.media('large')(`
    --gap-size: ${themeValues.gutter.large}px;
    --one-column-width: calc((100% - (var(--grid-gaps) * var(--gap-size))) / var(--grid-columns));
    --two-column-width: calc((var(--one-column-width) * 2) + var(--gap-size));
    --three-column-width: calc((var(--one-column-width) * 3) + (var(--gap-size) * 2));
    --four-column-width: calc((var(--one-column-width) * 4) + (var(--gap-size) * 3));
    --five-column-width: calc((var(--one-column-width) * 5) + (var(--gap-size) * 4));
    --six-column-width: calc((var(--one-column-width) * 6) + (var(--gap-size) * 5));
    --seven-column-width: calc((var(--one-column-width) * 7) + (var(--gap-size) * 6));
    --eight-column-width: calc((var(--one-column-width) * 8) + (var(--gap-size) * 7));
    --nine-column-width: calc((var(--one-column-width) * 9) + (var(--gap-size) * 8));
    --ten-column-width: calc((var(--one-column-width) * 10) + (var(--gap-size) * 9));
    --eleven-column-width: calc((var(--one-column-width) * 11) + (var(--gap-size) * 10));
    --twelve-column-width: 100%;
  `)}
`;

export const GridProvider = GlobalGridStyles;

export const Grid = styled.div<{ $noGap?: boolean }>`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));

  ${props =>
    !props.$noGap &&
    `
    gap: ${themeValues.gutter.small}px;
  `}

  ${props =>
    !props.$noGap &&
    props.theme.media('medium')(`
    gap: ${themeValues.gutter.medium}px;
  `)}

  ${props =>
    !props.$noGap &&
    props.theme.media('large')(`
    gap: ${themeValues.gutter.large}px;
  `)}
`;

// If a SizeMap has a key with only one item e.g. { s: [4] } the cell
// will not be given a starting track and so will layout in the
// next available grid column: `grid-column: span 4`

// If a SizeMap has a key with two items e.g. { s: [4, 2] } the
// first item will be the cell's span, and the second will be its
// starting track: grid-column: 2 / span 4

// If a SizeMap doesn't have a key for a given breakpoint, the cell
// will span the full width of the grid: `grid-column: 1 / -1`

export const GridCell = styled.div<{ $sizeMap: SizeMap }>`
  ${props =>
    props.theme.media('small')(`
      grid-column: ${props.$sizeMap.s ? (props.$sizeMap.s.length === 2 ? `${props.$sizeMap.s[1]} / span ${props.$sizeMap.s[0]}` : `span ${props.$sizeMap.s[0]}`) : '1 / -1'};
`)}
  ${props =>
    props.theme.media('medium')(`
      grid-column: ${props.$sizeMap.m ? (props.$sizeMap.m.length === 2 ? `${props.$sizeMap.m[1]} / span ${props.$sizeMap.m[0]}` : `span ${props.$sizeMap.m[0]}`) : '1 / -1'};
`)}
  ${props =>
    props.theme.media('large')(`
      grid-column: ${props.$sizeMap.l ? (props.$sizeMap.l.length === 2 ? `${props.$sizeMap.l[1]} / span ${props.$sizeMap.l[0]}` : `span ${props.$sizeMap.l[0]}`) : '1 / -1'};
`)}
  ${props =>
    props.theme.media('xlarge')(`
      grid-column: ${props.$sizeMap.xl ? (props.$sizeMap.xl.length === 2 ? `${props.$sizeMap.xl[1]} / span ${props.$sizeMap.xl[0]}` : `span ${props.$sizeMap.xl[0]}`) : '1 / -1'};
`)}
  container-type: inline-size;
  container-name: grid-cell;
`;

export const GridScroll = styled(Grid)`
  ${themeValues.mediaBetween(
    'small',
    'medium'
  )(`
    display: flex;
    flex-wrap: nowrap;
  `)}
`;

export const GridCellScroll = styled(GridCell)`
  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
      min-width: 75vw;
      padding-right: ${themeValues.gutter.small}px;
    `)};
`;
