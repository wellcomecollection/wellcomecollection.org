import { FunctionComponent, useState, useEffect } from 'react';
import {
  PhysicalItem,
  ItemsWork,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import Space from '@weco/common/views/components/styled/Space';
import {
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/common/utils/works';
import ButtonInlineLink from '@weco/common/views/components/ButtonInlineLink/ButtonInlineLink';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import { isCatalogueApiError } from '../../pages/api/works/items/[workId]';
import DescriptionList, {
  Props as DescriptionListProps,
} from '@weco/common/views/components/DescriptionList/DescriptionList';
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

function createDescriptionList(
  item: PhysicalItem,
  encoreLink: string | undefined
): DescriptionListProps | undefined {
  const physicalLocation = getFirstPhysicalLocation(item);
  const isRequestableOnline =
    physicalLocation?.accessConditions?.[0]?.method?.id === 'online-request';
  const accessMethodLabel =
    physicalLocation?.accessConditions?.[0]?.method?.label || '';
  const accessMethod =
    isRequestableOnline && encoreLink ? (
      <ButtonInlineLink text={accessMethodLabel} link={encoreLink} />
    ) : (
      <>{accessMethodLabel}</>
    );
  const accessStatus =
    physicalLocation?.accessConditions?.[0]?.status?.label || '';
  const accessTerms = physicalLocation?.accessConditions[0]?.terms || '';
  const locationId = physicalLocation?.locationType.id;
  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);
  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);
  const shelfmark = `${locationLabel ?? ''} ${locationShelfmark ?? ''}`;

  if (locationId !== 'on-order') {
    return {
      title: item.title || '',
      items: [
        { term: 'Location/shelfmark', description: shelfmark },
        accessMethod && { term: 'Access method', description: accessMethod },
        accessStatus && { term: 'Access status', description: accessStatus },
        accessTerms && { term: 'Access terms', description: accessTerms },
      ].filter(Boolean),
    };
  }
}

function createDescriptionLists(items, encoreLink) {
  return items
    .map(item => createDescriptionList(item, encoreLink))
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
  const descriptionLists = createDescriptionLists(physicalItems, encoreLink);

  const itemsOnOrder = items
    .map(item => {
      const physicalLocation = getFirstPhysicalLocation(item);
      const locationId = physicalLocation?.locationType.id;
      if (locationId === 'on-order') {
        return physicalLocation && getLocationLabel(physicalLocation);
      }
    })
    .filter(Boolean);

  useEffect(() => {
    const addStatusToItems = async () => {
      const work = await fetchWorkItems(workId);
      if (!isCatalogueApiError(work)) {
        const mergedItems = physicalItems.map(currentItem => {
          const matchingItem = work.items?.find(
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
    <>
      <ExpandableList
        listItems={descriptionLists.map((r, index) => (
          <Space
            key={index}
            v={{ size: 's', properties: ['margin-bottom', 'padding-bottom'] }}
            style={{ borderBottom: '1px dashed #ddd' }}
          >
            <DescriptionList title={r.title} items={r.items} />
          </Space>
        ))}
        initialItems={5}
      />

      {itemsOnOrder[0] && (
        <Space
          v={{
            size: 'l',
            properties: ['margin-bottom'],
          }}
        >
          <WorkDetailsText text={itemsOnOrder} />
        </Space>
      )}
    </>
  );
};

export default PhysicalItems;
