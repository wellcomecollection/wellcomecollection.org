// eslint-data-component: intentionally omitted
import { FunctionComponent, PropsWithChildren } from 'react';

import { Container } from '@weco/common/views/components/styled/Container';
import {
  Grid,
  GridCell,
  SizeMap,
} from '@weco/common/views/components/styled/Grid';

const gridSize6 = (): SizeMap => ({
  s: [12],
  m: [6, 2],
  l: [6, 2],
  xl: [6, 3],
});

const gridSize8 = (shift = true): SizeMap => ({
  s: [12],
  m: [10, shift ? 2 : 1],
  l: [8, shift ? 3 : 1],
  xl: [8, shift ? 3 : 1],
});

const gridSize10 = (isCentered = true): SizeMap => ({
  s: [12],
  m: [10, isCentered ? 2 : 1],
  l: [10, isCentered ? 2 : 1],
  xl: [10, isCentered ? 2 : 1],
});

const gridSize12 = (): SizeMap => ({
  s: [12],
  m: [12],
  l: [12],
  xl: [12],
});

type Props = PropsWithChildren<{
  gridSizes: SizeMap;
}>;

const ContaineredLayout: FunctionComponent<Props> = ({
  gridSizes,
  children,
}) => (
  <Container>
    <Grid>
      <GridCell $sizeMap={gridSizes}>{children}</GridCell>
    </Grid>
  </Container>
);

const Layout: FunctionComponent<Props> = ({ gridSizes, children }) => (
  <Grid>
    <GridCell $sizeMap={gridSizes}>{children}</GridCell>
  </Grid>
);

export { ContaineredLayout, gridSize12, gridSize10, gridSize8, gridSize6 };
export default Layout;
