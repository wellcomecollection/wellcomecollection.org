import { PhysicalItem } from '@weco/content/services/wellcome/catalogue/types';
import { PhysicalLocation } from '@weco/common/model/catalogue';
import { getFirstAccessCondition, getFirstPhysicalLocation } from './works';

const requestableStatusIds = ['open', 'open-with-advisory', 'restricted'];
const requestableMethodIds = ['online-request'];

const locationIsRequestable = (location: PhysicalLocation): boolean => {
  // In reality, there is only one access condition in a location
  // See https://github.com/wellcomecollection/platform/issues/5246
  const accessCondition = getFirstAccessCondition(location);
  const methodId = accessCondition?.method?.id;
  const statusId = accessCondition?.status?.id;

  return (
    requestableMethodIds.includes(methodId || '') &&
    requestableStatusIds.includes(statusId || '')
  );
};

export const itemIsRequestable = (item: PhysicalItem): boolean => {
  // ok because there is only one physical location in reality
  const physicalLocation = getFirstPhysicalLocation(item);
  return !!physicalLocation && locationIsRequestable(physicalLocation);
};

export const itemIsTemporarilyUnavailable = (item: PhysicalItem): boolean => {
  const physicalLocation = getFirstPhysicalLocation(item);
  const accessCondition = getFirstAccessCondition(physicalLocation);
  return accessCondition?.status?.id === 'temporarily-unavailable';
};
