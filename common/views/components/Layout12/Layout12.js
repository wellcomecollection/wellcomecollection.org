// @flow
import type {Node} from 'react';
import Layout from '../Layout/Layout';

type Props = {|
  children: Node
|}

const Layout12 = ({children}: Props) => (
  <Layout gridSizes={{s: 12, m: 12, l: 12, xl: 12}}>
    {children}
  </Layout>
);

export default Layout12;
