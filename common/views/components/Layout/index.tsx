import { FunctionComponent, PropsWithChildren } from 'react';

import { Container } from '@weco/common/views/components/styled/Container';
import {
  BetterSizeMap,
  GridCell,
} from '@weco/common/views/components/styled/GridCell';

const gridSize6 = (): BetterSizeMap => ({
  s: ['auto', 12],
  m: [2, 6],
  l: [3, 6],
  xl: [3, 6],
});

const gridSize8 = (shift = true): BetterSizeMap => ({
  s: ['auto', 12],
  m: [shift ? 2 : 'auto', 10],
  l: [shift ? 3 : 'auto', 8],
  xl: [shift ? 3 : 'auto', 8],
});

const gridSize10 = (isCentered = true): BetterSizeMap => ({
  s: ['auto', 12],
  m: [isCentered ? 2 : 'auto', 10],
  l: [isCentered ? 2 : 'auto', 10],
  xl: [isCentered ? 2 : 'auto', 10],
});

const gridSize12 = (): BetterSizeMap => ({
  s: ['auto', 12],
  m: ['auto', 12],
  l: ['auto', 12],
  xl: ['auto', 12],
});

type Props = PropsWithChildren<{
  gridSizes: BetterSizeMap;
}>;

const ContaineredLayout: FunctionComponent<Props> = ({
  gridSizes,
  children,
}) => (
  <Container>
    <div className="grid">
      <GridCell $sizeMap={gridSizes}>{children}</GridCell>
    </div>
  </Container>
);

const Layout: FunctionComponent<Props> = ({ gridSizes, children }) => (
  <div className="grid">
    <GridCell $sizeMap={gridSizes}>{children}</GridCell>
  </div>
);

export { ContaineredLayout, gridSize12, gridSize10, gridSize8, gridSize6 };
export default Layout;
