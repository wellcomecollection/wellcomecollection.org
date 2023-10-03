import { FunctionComponent, PropsWithChildren } from 'react';
import Layout from '@weco/common/views/components/Layout/Layout';

export const gridSize12 = { s: 12, m: 12, l: 12, xl: 12 };
const Layout12: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Layout gridSizes={gridSize12}>{children}</Layout>
);

export default Layout12;
