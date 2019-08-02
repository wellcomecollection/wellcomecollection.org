// @flow
import { classNames, font } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';
type Props = {|
  text: string,
|};

const Message = ({ text }: Props) => (
  <VerticalSpace
    v={{
      size: 'm',
      properties: ['padding-top', 'padding-bottom'],
    }}
    className={classNames({
      'border-left-width-5': true,
      'border-color-yellow': true,
      'inline-block': true,
      'padding-left-12 padding-right-12': true,
      [font('hnm', 5)]: true,
    })}
  >
    {text}
  </VerticalSpace>
);
export default Message;
