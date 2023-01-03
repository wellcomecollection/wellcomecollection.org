import { ReactNode, FunctionComponent } from 'react';
import { SizeMap } from '../../../utils/classnames';
import Grid from '../styled/Grid';

type Props = {
  gridSizes: SizeMap;
  children: ReactNode;
};

const Layout: FunctionComponent<Props> = ({ gridSizes, children }: Props) => (
  <div className="container">
    <Grid sizes={gridSizes}>{children}</Grid>
  </div>
);
export default Layout;
