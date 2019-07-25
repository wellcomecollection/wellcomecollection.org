import { grid, classNames } from '@weco/common/utils/classnames';
import { type Node } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type WobblyProps = {|
  children: Node,
|};

const WobblyRow = ({ children }: WobblyProps) => (
  <div
    className={classNames({
      'row bg-charcoal': true,
    })}
  >
    <div className="container">
      <div className="grid">
        <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>{children}</div>
      </div>
    </div>
    <WobblyEdge isValley={true} intensity={20} background={'white'} />
  </div>
);

export default WobblyRow;
