// @flow
import {font, spacing, conditionalClassNames} from '../../../utils/classnames';

type Props = {|
  label: string
|}

const Labels = ({
  label
}: Props) => (
  <ul className='flex plain-list no-margin no-padding line-height-1'>
    <ul
      key={label}
      className={conditionalClassNames({
        'line-height-1 bg-yellow': true,
        [font({s: 'HNM5'})]: true,
        [spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})]: true
      })}
      style={{
        display: 'block',
        float: 'left',
        marginRight: '1px',
        marginTop: '1px',
        whiteSpace: 'nowrap'
      }}>
      {label}
    </ul>
  </ul>
);

export default Labels;
