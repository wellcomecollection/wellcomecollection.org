// @flow
import {classNames, spacing, font} from '../../../utils/classnames';
type Props = {|
  text: string
|}

const Message = ({text}: Props) => (
  <div className={classNames({
    'border-left-width-5': true,
    'border-color-yellow': true,
    'inline-block': true,
    [spacing({s: 2}, {padding: ['left', 'right']})]: true,
    [spacing({s: 2}, {padding: ['top', 'bottom']})]: true,
    [font({s: 'HNM4'})]: true
  })}>
    {text}
  </div>
);
export default Message;
