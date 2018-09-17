import type {Node} from 'react';
import Layout from '../Layout/Layout';

type Props = {|
  children: Node
|}

const MaxL10Layout = ({children}: Props) => (
  <Layout gridSizes={{s: 12, m: 10, shiftM: 1, l: 10, shiftL: 1, xl: 10, shiftXl: 1}}>
    {children}
  </Layout>
);

export default MaxL10Layout;
