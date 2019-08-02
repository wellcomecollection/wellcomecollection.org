// @flow
import type { Label as LabelType } from '../../../model/labels';
import { font } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

export type Props = {|
  label: LabelType,
|};

const Label = ({ label }: Props) => {
  return (
    <VerticalSpace
      v={{
        size: 's',
        properties: ['padding-top', 'padding-bottom'],
      }}
      as={label.url ? 'a' : 'span'}
      href={label.url}
      className={`
      line-height-1
      ${
        label.url
          ? 'plain-link font-white bg-green bg-hover-black'
          : 'font-black bg-yellow'
      }
      ${font('hnm', 6)}
      padding-left-6 padding-right-6
    `}
      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
    >
      {label.text}
    </VerticalSpace>
  );
};

export default Label;
