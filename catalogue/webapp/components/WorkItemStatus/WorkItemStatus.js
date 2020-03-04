// @flow
import { type PhysicalItemAugmented } from '@weco/common/utils/works';

type Props = {| item: PhysicalItemAugmented |};

const WorkItemStatus = ({ item }: Props) => {
  return item.status ? (
    <span data-test-id="itemStatus">{item.status.label}</span>
  ) : null;
};

export default WorkItemStatus;
