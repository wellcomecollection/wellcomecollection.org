import { FunctionComponent } from 'react';
import Layout from '../Layout/Layout';

const Layout6: FunctionComponent = ({ children }) => (
  <Layout
    gridSizes={{
      s: 12,
      m: 6,
      shiftM: 1,
      l: 6,
      shiftL: 2,
      xl: 6,
      shiftXl: 2,
    }}
  >
    {children}
  </Layout>
);

export default Layout6;
