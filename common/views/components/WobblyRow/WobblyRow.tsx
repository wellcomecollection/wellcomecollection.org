import { FunctionComponent, ReactNode } from 'react';
import { grid, classNames } from '../../../utils/classnames';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import { repeatingLsBlack } from '../../../utils/backgrounds';

type Props = {
  children: ReactNode;
};

const WobblyRow: FunctionComponent<Props> = ({ children }: Props) => (
  <div
    className={classNames({
      'row bg-charcoal font-white relative': true,
    })}
  >
    <div
      style={{
        position: 'absolute',
        backgroundImage: `url(${repeatingLsBlack})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        opacity: 0.15,
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
      }}
    ></div>
    <div className="container">
      <div className="grid" style={{ marginTop: '50px' }}>
        <div
          className={grid({ s: 12, m: 12, l: 12, xl: 12 })}
          style={{ marginTop: '-50px', position: 'relative' }}
        >
          {children}
        </div>
      </div>
    </div>
    <WobblyEdge isValley={false} intensity={35} background={'white'} />
  </div>
);

export default WobblyRow;
