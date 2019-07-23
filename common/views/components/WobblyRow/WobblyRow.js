import { grid, classNames } from '@weco/common/utils/classnames';
import { type Node } from 'react';

type WobblyProps = {|
  children: Node,
|};

const WobblyRow = ({ children }: WobblyProps) => (
  <div
    className={classNames({
      'row bg-cream row--has-wobbly-background': true,
    })}
  >
    <div className="container">
      <div className="grid">
        <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>{children}</div>
      </div>
    </div>
    <div className="row__wobbly-background" />
  </div>
);

export default WobblyRow;
