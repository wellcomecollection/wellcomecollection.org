import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { LabelColor, Label as LabelType } from '@weco/common/model/labels';
import Space from '@weco/common/views/components/styled/Space';

import Label from './LabelsList.Label';

const List = styled(Space).attrs({
  $v: { size: 'xs', properties: ['row-gap'] },
  $h: { size: 'xs', properties: ['column-gap'] },
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

export function makeLabels(title?: string): Props | undefined {
  if (!title) return;

  return { labels: [{ text: title }] };
}

const LabelsList: FunctionComponent<Props> = ({
  labels,
  defaultLabelColor = 'yellow',
}: Props) => (
  <Space
    data-component="labels-list"
    $h={{ size: 'm', properties: ['padding-right'] }}
  >
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
