import styled from 'styled-components';

export type StartSpan = [span: number, start?: number];
export type SizeMap = Record<string, StartSpan>;

export const Grid = styled.div<{ $noGap?: boolean }>`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));

  ${props =>
    !props.$noGap &&
    `
    gap: ${props.theme.gutter.small};
  `}

  ${props =>
    !props.$noGap &&
    props.theme.media('sm')(`
    gap: ${props.theme.gutter.medium};
  `)}

  ${props =>
    !props.$noGap &&
    props.theme.media('md')(`
    gap: ${props.theme.gutter.large};
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
    props.theme.media('zero')(`
      grid-column: ${props.$sizeMap.s ? (props.$sizeMap.s.length === 2 ? `${props.$sizeMap.s[1]} / span ${props.$sizeMap.s[0]}` : `span ${props.$sizeMap.s[0]}`) : '1 / -1'};
`)}
  ${props =>
    props.theme.media('sm')(`
      grid-column: ${props.$sizeMap.m ? (props.$sizeMap.m.length === 2 ? `${props.$sizeMap.m[1]} / span ${props.$sizeMap.m[0]}` : `span ${props.$sizeMap.m[0]}`) : '1 / -1'};
`)}
  ${props =>
    props.theme.media('md')(`
      grid-column: ${props.$sizeMap.l ? (props.$sizeMap.l.length === 2 ? `${props.$sizeMap.l[1]} / span ${props.$sizeMap.l[0]}` : `span ${props.$sizeMap.l[0]}`) : '1 / -1'};
`)}
  ${props =>
    props.theme.media('lg')(`
      grid-column: ${props.$sizeMap.xl ? (props.$sizeMap.xl.length === 2 ? `${props.$sizeMap.xl[1]} / span ${props.$sizeMap.xl[0]}` : `span ${props.$sizeMap.xl[0]}`) : '1 / -1'};
`)}
  container-type: inline-size;
  container-name: grid-cell;
`;

export const GridScroll = styled(Grid)`
  ${props =>
    props.theme.mediaBetween(
      'zero',
      'sm'
    )(`
    display: flex;
    flex-wrap: nowrap;
  `)}
`;

export const GridCellScroll = styled(GridCell)`
  ${props =>
    props.theme.mediaBetween(
      'zero',
      'sm'
    )(`
      min-width: 75vw;
      padding-right: ${props.theme.gutter.small};
    `)};
`;
