import { FunctionComponent } from 'react';
import { grid, SizeMap } from '../../../utils/classnames';

type Props = {
  gridSizes: SizeMap;
};

const Layout: FunctionComponent<Props> = ({ gridSizes, children }) => (
  <div className="container">
    <div className="grid">
      <div className={grid(gridSizes)}>{children}</div>
    </div>
  </div>
);
export default Layout;
