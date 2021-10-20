import { PhysicalItem, PhysicalLocation } from '@weco/common/model/catalogue';
import { getFirstPhysicalLocation } from '@weco/common/utils/works';

const unrequestableStatusIds = ['temporarily-unavailable'];

const unrequestableMethodIds = [
  'not-requestable',
  'open-shelves',
  'manual-request',
];

const locationIsRequestable = (location: PhysicalLocation): boolean => {
  const accessCondition = location.accessConditions?.[0];
  const methodId = accessCondition?.method?.id;
  const statusId = accessCondition?.status?.id;

  return Boolean(
    methodId &&
      statusId &&
      !unrequestableMethodIds.includes(methodId) &&
      !unrequestableStatusIds.includes(statusId)
  );
};

export const itemIsRequestable = (item: PhysicalItem): boolean => {
  // ok because there is only one physical location in reality
  const physicalLocation = getFirstPhysicalLocation(item);
  return !!physicalLocation && locationIsRequestable(physicalLocation);
};

export const itemIsTemporarilyUnavailable = (item: PhysicalItem): boolean =>
  getFirstPhysicalLocation(item)?.accessConditions?.[0]?.status?.id ===
  'temporarily-unavailable';
