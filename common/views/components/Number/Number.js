// @flow
import { classNames, font } from '../../../utils/classnames';
import type { ColorSelection } from '../../../model/color-selections';

type Props = {|
  number: number,
  color: ?ColorSelection,
|};

const Number = ({ number, color }: Props) => (
  <span
    className={classNames({
      [font('wb', 5)]: true,
      [`bg-${color || 'purple'}`]: true,
      'margin-left-6': true,
    })}
    style={{
      transform: 'rotateZ(-6deg)',
      width: '24px',
      height: '24px',
      display: 'inline-block',
      borderRadius: '3px',
      textAlign: 'center',
    }}
  >
    <span
      className={color === 'yellow' ? 'font-black' : 'font-white'}
      style={{ transform: 'rotateZ(6deg) scale(1.2)' }}
    >
      {number}
    </span>
  </span>
);

export default Number;
