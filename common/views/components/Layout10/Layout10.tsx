import { FunctionComponent, PropsWithChildren } from 'react';
import Layout from '@weco/common/views/components/Layout/Layout';

type Props = PropsWithChildren<{
  isCentered?: boolean;
}>;

const Layout10: FunctionComponent<Props> = ({
  children,
  isCentered = true,
}) => (
  <Layout
    gridSizes={{
      s: 12,
      m: 10,
      shiftM: isCentered ? 1 : 0,
      l: 10,
      shiftL: isCentered ? 1 : 0,
      xl: 10,
      shiftXl: isCentered ? 1 : 0,
    }}
  >
    {children}
  </Layout>
);

export default Layout10;
