import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';
import { FunctionComponent } from 'react';

type Props = { title: string; list: string[] };

const WorkDetailsList: FunctionComponent<Props> = ({ title, list }: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
        as="ul"
        className="plain-list no-margin no-padding"
      >
        {list.map((item, i) => (
          <li key={i} style={{ listStylePosition: 'inside' }}>
            {item}
          </li>
        ))}
      </Space>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsList;
