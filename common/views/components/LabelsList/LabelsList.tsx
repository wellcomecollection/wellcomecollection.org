import { FunctionComponent } from 'react';
import { Label as LabelType, LabelColor } from '../../../model/labels';
import Label from '../../components/Label/Label';
import Space from '../styled/Space';
import styled from 'styled-components';

const List = styled(Space).attrs({
  v: {
    size: 'xs',
    properties: ['row-gap'],
  },
  h: { size: 'xs', properties: ['column-gap'] },
})`
  display: flex;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  list-style: none;
`;

export type Props = {
  labels: LabelType[];
  defaultLabelColor?: LabelColor;
};

const LabelsList: FunctionComponent<Props> = ({
  labels,
  defaultLabelColor = 'yellow',
}: Props) => (
  <Space h={{ size: 'm', properties: ['padding-right'] }}>
    <List as="ul">
      {labels.filter(Boolean).map((label, i) => (
        <li key={`${label.text}-${i}`}>
          <Label label={label} defaultLabelColor={defaultLabelColor} />
        </li>
      ))}
    </List>
  </Space>
);

export default LabelsList;
