import { FunctionComponent, PropsWithChildren } from 'react';

import { grid, SizeMap } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';

const gridSize6 = () => ({
  s: 12,
  m: 6,
  shiftM: 1,
  l: 6,
  shiftL: 2,
  xl: 6,
  shiftXl: 2,
});

const gridSize8 = (shift = true) => ({
  s: 12,
  m: 10,
  shiftM: shift ? 1 : 0,
  l: 8,
  shiftL: shift ? 2 : 0,
  xl: 8,
  shiftXL: shift ? 2 : 0,
});

const gridSize10 = (isCentered = true) => ({
  s: 12,
  m: 10,
  shiftM: isCentered ? 1 : 0,
  l: 10,
  shiftL: isCentered ? 1 : 0,
  xl: 10,
  shiftXl: isCentered ? 1 : 0,
});

const gridSize12 = () => ({ s: 12, m: 12, l: 12, xl: 12 });

type Props = PropsWithChildren<{
  gridSizes: SizeMap;
}>;

const ContaineredLayout: FunctionComponent<Props> = ({
  gridSizes,
  children,
}) => (
  <Container>
    <div className="grid">
      <div className={grid(gridSizes)}>{children}</div>
    </div>
  </Container>
);

const Layout: FunctionComponent<Props> = ({ gridSizes, children }) => (
  <div className="grid">
    <div className={grid(gridSizes)}>{children}</div>
  </div>
);

export { ContaineredLayout, gridSize12, gridSize10, gridSize8, gridSize6 };
export default Layout;
