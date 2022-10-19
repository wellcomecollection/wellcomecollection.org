import { FC } from 'react';
import { Label as LabelType, LabelColor } from '../../../model/labels';
import Label from '../../components/Label/Label';
import Space from '../styled/Space';
import styled from 'styled-components';

const List = styled(Space).attrs({
  v: {
    size: 'xs',
    properties: ['margin-bottom'],
    negative: true,
  },
  h: { size: 'm', properties: ['padding-right'] },
})`
  display: flex;
  padding: 0;
  margin-left: 0;
  margin-top: 0;
  flex-wrap: wrap;
  list-style: none;
`;

const ListItem = styled(Space).attrs({
  v: {
    size: 'xs',
    properties: ['margin-bottom'],
  },
  h: { size: 'xs', properties: ['margin-right'] },
})``;

export type Props = {
  labels: LabelType[];
  defaultLabelColor?: LabelColor;
};

const LabelsList: FC<Props> = ({
  labels,
  defaultLabelColor = 'yellow',
}: Props) => (
  <List as="ul">
    {labels.filter(Boolean).map((label, i) => (
      <ListItem as="li" key={`${label.text}-${i}`}>
        <Label label={label} defaultLabelColor={defaultLabelColor} />
      </ListItem>
    ))}
  </List>
);

export default LabelsList;
