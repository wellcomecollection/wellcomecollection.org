import styled from 'styled-components';

import { themeValues } from '@weco/common/views/themes/config';

type StartSpan = [span: number, start?: number];
export type BetterSizeMap = Record<string, StartSpan>;

// If a SizeMap has a key with only one item e.g. { s: [4] } the cell
// will not be given a starting track and so will layout in the
// next available grid column: `grid-column: span 4`

// If a SizeMap has a key with two items e.g. { s: [4, 2] } the
// first item will be the cell's span, and the second will be its
// starting track: grid-column: 2 / span 4

// If a SizeMap doesn't have a key for a given breakpoint, the cell
// will span the full width of the grid: `grid-column: 1 / -1`

export const GridCell = styled.div<{ $sizeMap: BetterSizeMap }>`
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

export const GridCellScrollContainer = styled.div.attrs({
  className: 'grid',
})`
  ${themeValues.mediaBetween(
    'small',
    'medium'
  )(`
    display: flex !important;
    flex-wrap: nowrap;
  `)}
`;
