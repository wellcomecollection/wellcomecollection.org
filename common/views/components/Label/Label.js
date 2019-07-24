// @flow
import type { Label as LabelType } from '../../../model/labels';
import { font, spacing } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

export type Props = {|
  label: LabelType,
|};

const Label = ({ label }: Props) => {
  return (
    <VerticalSpace
      as={label.url ? 'a' : 'span'}
      size="s"
      properties={['padding-top', 'padding-bottom']}
      href={label.url}
      className={`
      line-height-1
      ${
        label.url
          ? 'plain-link font-white bg-green bg-hover-black'
          : 'font-black bg-yellow'
      }
      ${font('hnm', 6)}
      ${spacing({ s: 1 }, { padding: ['left', 'right'] })}
    `}
      style={{ display: 'block', whiteSpace: 'nowrap' }}
    >
      {label.text}
    </VerticalSpace>
  );
};

export default Label;
