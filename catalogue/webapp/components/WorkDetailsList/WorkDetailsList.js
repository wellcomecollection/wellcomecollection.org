// @flow
import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';

type Props = {| title: string, list: string[] |};

const WorkDetailsList = ({ title, list }: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
        as="ul"
        className={classNames({
          'plain-list no-margin no-padding': true,
        })}
      >
        {list.map((item, i, arr) => (
          <li key={i} style={{ listStylePosition: 'inside' }}>
            {item}
          </li>
        ))}
      </Space>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsList;
