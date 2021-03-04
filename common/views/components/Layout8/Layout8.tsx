import { ReactNode, FunctionComponent } from 'react';
import Layout from '../Layout/Layout';

type Props = {
  children: ReactNode;
  shift?: boolean;
};

const Layout8: FunctionComponent<Props> = ({
  children,
  shift = true,
}: Props) => (
  <Layout
    gridSizes={{
      s: 12,
      m: 10,
      shiftM: 1,
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
