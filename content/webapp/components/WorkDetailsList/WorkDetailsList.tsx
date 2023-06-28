import styled from 'styled-components';
import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';

const PlainList = styled(Space)`
  list-style: none;
  padding: 0;
  margin: 0;
`;
type Props = { title: string; list: string[] };

const WorkDetailsList: FunctionComponent<Props> = ({ title, list }: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <PlainList as="ul">
        {list.map((item, i) => (
          <li key={i} style={{ listStylePosition: 'inside' }}>
            {item}
          </li>
        ))}
      </PlainList>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsList;
