// @flow
import {classNames, spacing, font} from '../../../utils/classnames';
import type {ColorSelection} from '../../../model/color-selections';

type Props = {|
  number: number,
  color: ?ColorSelection
|};

const PartNumberIndicator = ({
  number,
  color
}: Props) => (
  <div className={classNames({
    [font({s: 'WB7'})]: true
  })}>Part
    <span
      className={classNames({
        [`bg-${color || 'purple'}`]: true,
        [spacing({s: 1}, {margin: ['left']})]: true
      })}
      style={{
        transform: 'rotateZ(-6deg)',
        width: '24px',
        height: '24px',
        display: 'inline-block',
        borderRadius: '3px',
        textAlign: 'center'
      }}>
      <span className={'font-white'} style={{transform: 'rotateZ(6deg) scale(1.2)'}}>
        {number}
      </span>
    </span>
  </div>
);

export default PartNumberIndicator;
