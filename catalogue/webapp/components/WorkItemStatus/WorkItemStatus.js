// @flow
import { type PhysicalItemWithStatus } from '@weco/common/utils/works';

type Props = {| item: PhysicalItemWithStatus |};

const WorkItemStatus = ({ item }: Props) => {
  return item.status ? (
    <span data-test-id="itemStatus">{item.status.label}</span>
  ) : null;
};

export default WorkItemStatus;
