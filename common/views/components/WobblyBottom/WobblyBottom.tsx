import { Fragment, FunctionComponent, ReactNode } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type Props = {
  color: 'warmNeutral.300' | 'white';
  children: ReactNode;
};

const WobblyBottom: FunctionComponent<Props> = ({ color, children }: Props) => (
  <div className="relative">
    <Fragment>
      {children}
      <WobblyEdge background={color} />
    </Fragment>
  </div>
);
export default WobblyBottom;
