// @flow
import type { Label as LabelType } from '../../../model/labels';
import { sized } from '../../../utils/style';
import Label from '../../components/Label/Label';
import Space from '../styled/Space';

type Props = {|
  labels: LabelType[],
|};

const LabelsList = ({ labels }: Props) => (
  <Space
    v={{
      size: 'xs',
      properties: ['margin-bottom'],
      negative: true,
    }}
    as="ul"
    className={`flex-inline plain-list no-margin no-padding padding-right-12`}
    style={{ flexWrap: 'wrap' }}
  >
    {labels.filter(Boolean).map((label, i) => (
      <Space
        v={{
          size: 'xs',
          properties: ['margin-bottom'],
        }}
        as="li"
        key={`${label.text}-${i}`}
        style={{
          float: 'left',
          marginRight: sized(0.5),
        }}
      >
        <Label label={label} />
      </Space>
    ))}
  </Space>
);

export default LabelsList;
