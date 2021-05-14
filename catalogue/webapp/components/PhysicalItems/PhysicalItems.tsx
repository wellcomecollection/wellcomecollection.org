import { FunctionComponent, ReactElement, useState, useEffect } from 'react';
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
import { isCatalogueApiError } from '../../pages/api/works/items';

async function fetchWorkItems(
  workId: string
): Promise<ItemsWork | CatalogueApiError> {
  const items = await fetch(`/api/works/items?workId=${workId}`);
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

function createBodyRow(
  item: PhysicalItem,
  encoreLink: string | undefined
): (string | ReactElement)[] | undefined {
  const physicalLocation = getFirstPhysicalLocation(item);
  const locationId = physicalLocation?.locationType.id;
  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);
  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);
  const shelfmark = `${locationLabel ?? ''} ${locationShelfmark ?? ''}`;
  const accessId = physicalLocation?.accessConditions[0]?.status?.id ?? '';
  const accessLabel =
    physicalLocation?.accessConditions[0]?.status?.label ?? '';

  if (locationId !== 'on-order') {
    return [
      // We don't want to display items that are on order in a table, we just show the location label
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
  }
}

function createBodyRows(items, encoreLink) {
  return items.map(item => createBodyRow(item, encoreLink)).filter(Boolean);
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
  const hasStatus = physicalItems.some(item => item.status);
  const headerRow = [
    hasStatus && 'Status',
    'Location/Shelfmark',
    'Access',
    'Title',
  ].filter(Boolean);
  const bodyRows = createBodyRows(physicalItems, encoreLink);

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
      // }
    };
    addStatusToItems();
  }, []);

  return (
    <>
      {Boolean(bodyRows.length) && (
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <Table
            hasRowHeaders={false}
            rows={[headerRow, ...bodyRows]}
            vAlign="middle"
          />
        </Space>
      )}
      {accessCondtionsTerms[0] && (
        <Space
          v={{
            size: 'l',
            properties: ['margin-bottom'],
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
