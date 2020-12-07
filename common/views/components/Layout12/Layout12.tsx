import { ReactNode, FunctionComponent } from 'react';
import Layout from '../Layout/Layout';

type Props = {
  children: ReactNode;
};

const Layout12: FunctionComponent = ({ children }: Props) => (
  <Layout gridSizes={{ s: 12, m: 12, l: 12, xl: 12 }}>{children}</Layout>
);

export default Layout12;
