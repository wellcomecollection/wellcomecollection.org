// @flow
import type { Label as LabelType } from '../../../model/labels';
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
    h={{ size: 'm', properties: ['padding-right'] }}
    as="ul"
    className={`flex plain-list no-padding flex--wrap`}
    style={{ marginLeft: 0, marginTop: 0 }}
  >
    {labels.filter(Boolean).map((label, i) => (
      <Space
        v={{
          size: 'xs',
          properties: ['margin-bottom'],
        }}
        h={{ size: 'xs', properties: ['margin-right'] }}
        as="li"
        key={`${label.text}-${i}`}
      >
        <Label label={label} />
      </Space>
    ))}
  </Space>
);

export default LabelsList;
