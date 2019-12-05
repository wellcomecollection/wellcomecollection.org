// @flow
import type { ColorSelection } from '../../../model/color-selections';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = {|
  number: number,
  color: ?ColorSelection,
|};

const Number = ({ number, color }: Props) => (
  <Space
    as="span"
    h={{ size: 's', properties: ['margin-left'] }}
    className={classNames({
      [font('wb', 5)]: true,
      [`bg-${color || 'purple'}`]: true,
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
  </Space>
);

export default Number;
