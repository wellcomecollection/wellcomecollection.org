// @flow
import Space from '@weco/common/views/components/styled/Space';

type Props = {| item: any |}; // TODO

const WorkItemsStatus = ({ item }: Props) => {
  return (
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
  );
};

export default WorkItemsStatus;
