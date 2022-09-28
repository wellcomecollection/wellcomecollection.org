import { Fragment, FunctionComponent } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type Props = {
  color: 'warmNeutral.300' | 'white';
};

const WobblyBottom: FunctionComponent<Props> = ({ color, children }) => (
  <div className="relative">
    <Fragment>
      {children}
      <WobblyEdge background={color} />
    </Fragment>
  </div>
);
export default WobblyBottom;
