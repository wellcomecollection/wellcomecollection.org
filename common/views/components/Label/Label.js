// @flow
import type { Label as LabelType } from '../../../model/labels';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';

export type Props = {|
  label: LabelType,
|};

const Label = ({ label }: Props) => {
  return (
    <Space
      v={{
        size: 's',
        properties: ['padding-top', 'padding-bottom'],
      }}
      h={{ size: 's', properties: ['padding-left', 'padding-right'] }}
      as={label.url ? 'a' : 'div'}
      href={label.url}
      className={`
      nowrap
      line-height-1
      ${
        label.url
          ? 'plain-link font-white bg-green bg-hover-black'
          : 'font-black bg-yellow'
      }
      ${font('hnm', 6)}
    `}
    >
      {label.text}
    </Space>
  );
};

export default Label;
