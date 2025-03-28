import { FunctionComponent, PropsWithChildren } from 'react';

import { Container } from '@weco/common/views/components/styled/Container';
import {
  BetterSizeMap,
  GridCell,
} from '@weco/common/views/components/styled/GridCell';

const gridSize6 = (): BetterSizeMap => ({
  s: [12],
  m: [6, 2],
  l: [6, 2],
  xl: [3, 6],
});

const gridSize8 = (shift = true): BetterSizeMap => ({
  s: [12],
  m: [10, shift ? 2 : 1],
  l: [8, shift ? 3 : 1],
  xl: [8, shift ? 3 : 1],
});

const gridSize10 = (isCentered = true): BetterSizeMap => ({
  s: [12],
  m: [10, isCentered ? 2 : 1],
  l: [10, isCentered ? 2 : 1],
  xl: [10, isCentered ? 2 : 1],
});

const gridSize12 = (): BetterSizeMap => ({
  s: [12],
  m: [12],
  l: [12],
  xl: [12],
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
