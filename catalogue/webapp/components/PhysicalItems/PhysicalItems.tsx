import { FunctionComponent, useState, useEffect } from 'react';
import PhysicalItemDetails, {
  Props as PhysicalItemProps,
} from '../PhysicalItemDetails/PhysicalItemDetails';
import {
  PhysicalItem,
  ItemsWork,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import {
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/common/utils/works';
import { isCatalogueApiError } from '../../pages/api/works/items/[workId]';
import ExpandableList from '@weco/common/views/components/ExpandableList/ExpandableList';

async function fetchWorkItems(
  workId: string
): Promise<ItemsWork | CatalogueApiError> {
  const items = await fetch(`/api/works/items/${workId}`);
  const itemsJson = await items.json();
  return itemsJson;
}

function getFirstPhysicalLocation(item) {
  // In practice we only expect one physical location per item
  return item.locations?.find(location => location.type === 'PhysicalLocation');
}

function getColorForLocation(label: string): string | undefined {
  switch (label) {
    case 'Journals':
      return 'green';
    case 'History of Medicine':
      return 'red';
    case 'Medical Collection':
      return 'orange';
    case 'Quick Reference':
    case 'Student Loan':
      return 'purple';
    default:
      return undefined;
  }
}

function createPhysicalItem(
  item: PhysicalItem,
  encoreLink: string | undefined
): PhysicalItemProps | undefined {
  const physicalLocation = getFirstPhysicalLocation(item);
  const isOnOpenShelves = physicalLocation?.locationType?.id === 'open-shelves';
  const color = isOnOpenShelves
    ? getColorForLocation(physicalLocation.label)
    : undefined;
  const isRequestableOnline =
    physicalLocation?.accessConditions?.[0]?.method?.id === 'online-request';
  const accessMethodLabel =
    physicalLocation?.accessConditions?.[0]?.method?.label || '';
  const accessNote = physicalLocation?.accessConditions?.[0]?.note;
  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);
  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);
  const locationAndShelfmark = `${locationLabel ?? ''} ${locationShelfmark ??
    ''}`;

  return {
    title: item.title || '',
    itemNote: item.note || '',
    locationAndShelfmark: locationAndShelfmark,
    accessMethod: accessMethodLabel,
    requestItemUrl: isRequestableOnline ? encoreLink : undefined,
    accessNote: accessNote,
    color: color,
  };
}

function createPhysicalItems(items, encoreLink) {
  return items
    .map(item => createPhysicalItem(item, encoreLink))
    .filter(Boolean);
}

type Props = {
  workId: string;
  items: PhysicalItem[];
  encoreLink: string | undefined;
};

const PhysicalItems: FunctionComponent<Props> = ({
  workId,
  items,
  encoreLink,
}: Props) => {
  const [physicalItems, setPhysicalItems] = useState(items);
  const itemsToRender = createPhysicalItems(physicalItems, encoreLink);

  useEffect(() => {
    const addStatusToItems = async () => {
      const items = await fetchWorkItems(workId);
      if (!isCatalogueApiError(items)) {
        const mergedItems = physicalItems.map(currentItem => {
          const matchingItem = items.results?.find(
            item => item.id === currentItem.id
          );
          return {
            ...matchingItem,
            ...currentItem,
          };
        });
        setPhysicalItems(mergedItems);
      }
      // else {
      // tell the user something about not being able to retrieve the status of the item(s)
      // we may find we run into 429s from our rate limiting, so worth bearing in mind that we might want to handle that as a separate case
      // }
    };
    addStatusToItems();
  }, []);

  return (
    <ExpandableList
      listItems={itemsToRender.map((props, index) => (
        <PhysicalItemDetails {...props} key={index} />
      ))}
      initialItems={5}
    />
  );
};

export default PhysicalItems;
