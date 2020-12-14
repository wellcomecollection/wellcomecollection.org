// @flow
import type { Label as LabelType } from '../../../model/labels';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

export type Props = {|
  label: LabelType,
  labelColor?: 'orange' | 'yellow' | 'black',
  roundedDiagonal?: boolean,
|};

const Label = ({ label, labelColor = 'yellow', roundedDiagonal = false }: Props) => {
  const fontColor = labelColor === 'black' ? 'yellow' : 'black';
  return (
    <Space
      v={{
        size: 's',
        properties: ['padding-top', 'padding-bottom'],
      }}
      h={{ size: 's', properties: ['padding-left', 'padding-right'] }}
      as={label.url ? 'a' : 'div'}
      href={label.url}
      className={`${classNames({
        'nowrap line-height-1': true,
        'plain-link font-white bg-green bg-hover-black': label.url,
        'rounded-diagonal': roundedDiagonal,
        [font('hnm', 6)]: true,
      })}
       ${label.url ? '' : `bg-${labelColor}`}
       ${label.url ? '' : `font-${fontColor}`}
      `}
    >
      {label.text}
    </Space>
  );
};

export default Label;
