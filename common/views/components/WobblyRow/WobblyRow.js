import { grid, classNames } from '@weco/common/utils/classnames';
import { type Node } from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import { repeatingLsBlack } from '../../../utils/backgrounds';

type WobblyProps = {|
  children: Node,
|};

const WobblyRow = ({ children }: WobblyProps) => (
  <div
    className={classNames({
      'row bg-charcoal relative': true,
    })}
  >
    <div
      style={{
        position: 'absolute',
        backgroundImage: `url(${repeatingLsBlack})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        opacity: 0.15,
        height: '65%',
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        transform: 'scale(1.5)',
        transformOrigin: 'top left',
      }}
    ></div>
    <div className="container">
      <div className="grid" style={{ marginTop: '50px' }}>
        <div
          className={grid({ s: 12, m: 12, l: 12, xl: 12 })}
          style={{ marginTop: '-50px' }}
        >
          {children}
        </div>
      </div>
    </div>
    <WobblyEdge isValley={true} intensity={25} background={'white'} />
  </div>
);

export default WobblyRow;
