import { FunctionComponent, PropsWithChildren } from 'react';
import { grid, SizeMap } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';

type Props = PropsWithChildren<{
  gridSizes: SizeMap;
}>;

const Layout: FunctionComponent<Props> = ({ gridSizes, children }) => (
  <Container>
    <div className="grid">
      <div className={grid(gridSizes)}>{children}</div>
    </div>
  </Container>
);
export default Layout;
