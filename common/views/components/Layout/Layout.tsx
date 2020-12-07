import { ReactNode, FunctionComponent } from 'react';
import { classNames, grid, SizeMap } from '../../../utils/classnames';

type Props = {
  gridSizes: SizeMap;
  children: ReactNode;
};

const Layout: FunctionComponent<Props> = ({ gridSizes, children }: Props) => (
  <div className="container">
    <div className="grid">
      <div
        className={classNames({
          [grid(gridSizes)]: true,
        })}
      >
        {children}
      </div>
    </div>
  </div>
);
export default Layout;
