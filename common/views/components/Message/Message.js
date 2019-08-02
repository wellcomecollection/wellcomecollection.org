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
    h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
    className={classNames({
      'border-left-width-5': true,
      'border-color-yellow': true,
      'inline-block': true,
      [font('hnm', 5)]: true,
    })}
  >
    {text}
  </Space>
);
export default Message;
