import { FunctionComponent, useState, useEffect, useRef } from 'react';
import {
  PhysicalItem,
  ItemsWork,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import Table from '@weco/common/views/components/Table/Table';
import Space from '@weco/common/views/components/styled/Space';
import {
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/common/utils/works';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import { isCatalogueApiError } from '../../pages/api/items';

async function fetchWorkItems(
  workId: string
): Promise<ItemsWork | CatalogueApiError> {
  const items = await fetch(`/api/items?id=${workId}`);
  const itemsJson = await items.json();
  return itemsJson;
}

function isRequestableByLocation(id: string): boolean {
  return Boolean(id !== 'on-exhibition' && id !== 'open-shelves');
}

function isRequestableByAccessCondition(id: string): boolean {
  return Boolean(id !== 'by-appointment' && id !== 'restricted');
}

function getFirstPhysicalLocation(item) {
  // In practice we only expect one physical location per item
  return item.locations?.find(location => location.type === 'PhysicalLocation');
}

type Props = { workId: string; items: PhysicalItem[]; encoreLink: string };
const PhysicalItems: FunctionComponent<Props> = ({
  workId,
  items,
  encoreLink,
}: Props) => {
  const [physicalItems, setPhysicalItems] = useState(items);
  const itemsRef = useRef(physicalItems);
  itemsRef.current = physicalItems;
  const hasStatus = itemsRef.current.some(item => item.status);
  const headerRow = [
    hasStatus && 'Status',
    'Title',
    'Location',
    'Shelfmark',
  ].filter(Boolean);
  const bodyRows = itemsRef.current
    .map(item => {
      const physicalLocation = getFirstPhysicalLocation(item);
      const locationId = physicalLocation?.locationType.id;
      const locationLabel =
        physicalLocation && getLocationLabel(physicalLocation);
      const locationShelfmark =
        physicalLocation && getLocationShelfmark(physicalLocation);
      const shelfmark = `${locationLabel ?? ''} ${locationShelfmark ?? ''}`;
      const accessId = physicalLocation?.accessConditions[0]?.status?.id ?? '';
      const accessLabel =
        physicalLocation?.accessConditions[0]?.status?.label ?? '';

      // We don't want to display items that are on order in a table, we just show the location label
      if (locationId !== 'on-order') {
        return [
          item.status?.label,
          shelfmark,
          isRequestableByLocation(locationId) &&
          isRequestableByAccessCondition(accessId) &&
          encoreLink ? (
            <ButtonOutlinedLink text="Request item" link={encoreLink} />
          ) : (
            accessLabel || physicalLocation?.locationType.label
          ),
          item.title || 'n/a',
        ].filter(Boolean);
      } else {
        return [];
      }
    })
    .filter(Boolean);

  const accessCondtionsTerms = items
    .map(item => {
      const physicalLocation = getFirstPhysicalLocation(item);
      return physicalLocation?.accessConditions[0]?.terms ?? null;
    })
    .filter(Boolean);

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
        const mergedItems = itemsRef.current.map(currentItem => {
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
      // }
    };
    addStatusToItems();
  }, []);

  return (
    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
      {bodyRows[0][0] && (
        <Table hasRowHeaders={false} rows={[headerRow, ...bodyRows]} />
      )}
      {accessCondtionsTerms[0] && (
        <Space
          v={{
            size: 'l',
            properties: ['margin-top'],
          }}
        >
          <WorkDetailsText
            title="Access conditions"
            text={accessCondtionsTerms}
          />
        </Space>
      )}
      {itemsOnOrder[0] && (
        <Space
          v={{
            size: 'l',
            properties: ['margin-top'],
          }}
        >
          <WorkDetailsText text={itemsOnOrder} />
        </Space>
      )}
    </Space>
  );
};

export default PhysicalItems;
