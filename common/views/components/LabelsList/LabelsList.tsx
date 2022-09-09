import { FunctionComponent } from 'react';
import { Label as LabelType, LabelColor } from '../../../model/labels';
import Label from '../../components/Label/Label';
import Space from '../styled/Space';

export type Props = {
  labels: LabelType[];
  defaultLabelColor?: LabelColor;
};

const LabelsList: FunctionComponent<Props> = ({
  labels,
  defaultLabelColor = 'yellow',
}: Props) => (
  <Space
    v={{
      size: 'xs',
      properties: ['margin-bottom'],
      negative: true,
    }}
    h={{ size: 'm', properties: ['padding-right'] }}
    as="ul"
    className="flex plain-list no-padding flex--wrap"
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
        <Label label={label} defaultLabelColor={defaultLabelColor} />
      </Space>
    ))}
  </Space>
);

export default LabelsList;
