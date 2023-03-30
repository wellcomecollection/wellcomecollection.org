import { ReactNode, FunctionComponent } from 'react';
import Layout from '../Layout/Layout';

type Props = {
  children: ReactNode;
};

export const gridSize12 = { s: 12, m: 12, l: 12, xl: 12 };
const Layout12: FunctionComponent<Props> = ({ children }) => (
  <Layout gridSizes={gridSize12}>{children}</Layout>
);

export default Layout12;
