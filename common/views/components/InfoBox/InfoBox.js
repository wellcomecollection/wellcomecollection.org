// @flow
import {spacing} from '../../../utils/classnames';

type Props = {|
  title: string,
  items: InfoBoxItem[]
|}

const InfoBox = ({
  title,
  items
}: Props) => (
  <div className={`bg-yellow ${spacing({s: 4}, {padding: ['top', 'right', 'bottom', 'left']})} ${spacing({s: 4}, {margin: ['top', 'bottom']})}`}>
    <h2 className='h2'>{title}</h2>
  </div>
);

export default InfoBox;
