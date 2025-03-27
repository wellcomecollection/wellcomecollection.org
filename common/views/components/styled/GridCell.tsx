import styled from 'styled-components';
type StartSpan = [start: number | 'auto', span: number];
export type BetterSizeMap = Record<string, StartSpan>;

export const GridCell = styled.div<{ $sizeMap: BetterSizeMap }>`
  ${props =>
    props.theme.media('small')(`
      grid-column: ${props.$sizeMap.s ? ` ${props.$sizeMap.s[0]} / span ${props.$sizeMap.s[1]}` : 'auto / span 12'};
`)}
  ${props =>
    props.theme.media('medium')(`
      grid-column: ${props.$sizeMap.m ? `${props.$sizeMap.m[0]} / span ${props.$sizeMap.m[1]}` : 'auto / span 12'};
`)}
  ${props =>
    props.theme.media('large')(`
      grid-column: ${props.$sizeMap.l ? `${props.$sizeMap.l[0]} / span ${props.$sizeMap.l[1]}` : 'auto / span 12'};
`)}
  ${props =>
    props.theme.media('xlarge')(`
      grid-column: ${props.$sizeMap.xl ? `${props.$sizeMap.xl[0]} / span ${props.$sizeMap.xl[1]}` : 'auto / span 12'};
`)}
`;
