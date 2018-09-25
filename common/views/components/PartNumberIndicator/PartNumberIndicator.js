// @flow
import {classNames, spacing, font} from '../../../utils/classnames';

type Props = {| n: number |};

const PartNumberIndicator = ({n}: Props) => (
  <div className={classNames({
    [font({s: 'WB7'})]: true
  })}>Part
    <span
      className={classNames({
        'bg-purple': true,
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
        {n}
      </span>
    </span>
  </div>
);

export default PartNumberIndicator;
