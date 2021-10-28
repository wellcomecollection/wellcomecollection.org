import { Fragment, FC, ReactNode } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type Props = {
  color: 'cream' | 'white';
  children: ReactNode;
};

const WobblyBottom: FC<Props> = ({ color, children }: Props) => (
  <div className="relative">
    <Fragment>
      {children}
      <WobblyEdge background={color} />
    </Fragment>
  </div>
);
export default WobblyBottom;
