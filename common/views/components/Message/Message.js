// @flow
import { classNames, spacing, font } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';
type Props = {|
  text: string,
|};

const Message = ({ text }: Props) => (
  <VerticalSpace
    size="m"
    properties={['padding-top', 'padding-bottom']}
    className={classNames({
      'border-left-width-5': true,
      'border-color-yellow': true,
      'inline-block': true,
      [spacing({ s: 2 }, { padding: ['left', 'right'] })]: true,
      [font('hnm', 5)]: true,
    })}
  >
    {text}
  </VerticalSpace>
);
export default Message;
