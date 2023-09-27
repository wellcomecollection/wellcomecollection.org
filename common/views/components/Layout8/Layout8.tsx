import { FunctionComponent, PropsWithChildren } from 'react';
import Layout from '@weco/common/views/components/Layout/Layout';

type Props = PropsWithChildren<{
  shift?: boolean;
}>;

const Layout8: FunctionComponent<Props> = ({ children, shift = true }) => (
  <Layout
    gridSizes={{
      s: 12,
      m: 10,
      shiftM: shift ? 1 : 0,
      l: 8,
      shiftL: shift ? 2 : 0,
      xl: 8,
      shiftXL: shift ? 2 : 0,
    }}
  >
    {children}
  </Layout>
);

export default Layout8;
