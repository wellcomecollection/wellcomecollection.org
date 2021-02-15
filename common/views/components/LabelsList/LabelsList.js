// @flow
import type { Label as LabelType } from '../../../model/labels';
import Label from '../../components/Label/Label';
// $FlowFixMe (tsx)
import Space from '../styled/Space';

type Props = {|
  labels: LabelType[],
  labelColor?: 'orange' | 'yellow' | 'black' | 'cream',
  roundedDiagonal?: boolean,
|};

const LabelsList = ({
  labels,
  labelColor = 'yellow',
  roundedDiagonal = false,
}: Props) => (
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
        <Label
          label={label}
          labelColor={labelColor}
          roundedDiagonal={roundedDiagonal}
        />
      </Space>
    ))}
  </Space>
);

export default LabelsList;
