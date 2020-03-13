// @flow
import Space from '@weco/common/views/components/styled/Space';
import { type PhysicalItemWithStatus } from '@weco/common/utils/works';

type Props = {| item: PhysicalItemWithStatus |};

const WorkItemStatus = ({ item }: Props) => {
  return item.status ? (
    <Space
      v={{
        size: 'l',
        properties: ['margin-bottom'],
      }}
    >
      <p className="no-margin">
        <span data-test-id="itemStatus">{item.status.label}</span>
      </p>
    </Space>
  ) : null;
};

export default WorkItemStatus;
