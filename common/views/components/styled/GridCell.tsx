import styled from 'styled-components';
type BetterSizeMap = Record<string, [start: number, span: number]>;

export const GridCell = styled.div<{ $sizeMap: BetterSizeMap }>`
  ${props =>
    props.theme.media('small')(`
    grid-column: ${props.$sizeMap.s[0]} / span ${props.$sizeMap.s[1]};
`)}
  ${props =>
    props.theme.media('medium')(`
    grid-column: ${props.$sizeMap.m[0]} / span ${props.$sizeMap.m[1]};
`)}
  ${props =>
    props.theme.media('large')(`
    grid-column: ${props.$sizeMap.l[0]} / span ${props.$sizeMap.l[1]};
`)}
  ${props =>
    props.theme.media('xlarge')(`
    grid-column: ${props.$sizeMap.xl[0]} / span ${props.$sizeMap.xl[1]};
`)}
`;
