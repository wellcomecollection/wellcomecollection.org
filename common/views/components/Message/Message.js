// @flow
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
type Props = {|
  text: string,
|};

const Message = ({ text }: Props) => (
  <Space
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
  </Space>
);
export default Message;
