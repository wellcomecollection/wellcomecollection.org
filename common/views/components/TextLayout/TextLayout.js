import type {Node} from 'react';
import Layout from '../Layout/Layout';

type Props = {|
  children: Node
|}

const TextLayout = ({children}: Props) => (
  <Layout gridSizes={{s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2}}>
    {children}
  </Layout>
);

export default TextLayout;
