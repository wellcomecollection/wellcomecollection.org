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
import ButtonInlineLink from '@weco/common/views/components/ButtonInlineLink/ButtonInlineLink';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import { isCatalogueApiError } from '../../pages/api/works/items/[workId]';

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

function createBodyRow(
  item: PhysicalItem,
  encoreLink: string | undefined
): (string | ReactElement)[] | undefined {
  const physicalLocation = getFirstPhysicalLocation(item);
  const isRequestableOnline =
    physicalLocation?.accessConditions?.[0]?.method?.id === 'online-request';
  const accessMethod =
    physicalLocation?.accessConditions?.[0]?.method?.label || ' ';
  const accessMethodColumn =
    isRequestableOnline && encoreLink ? (
      <ButtonInlineLink text={accessMethod} link={encoreLink} />
    ) : (
      <>{accessMethod}</>
    );
  const accessStatus =
    physicalLocation?.accessConditions?.[0]?.status?.label || ' ';
  const accessTerms = physicalLocation?.accessConditions[0]?.terms || ' ';
  const locationId = physicalLocation?.locationType.id;
  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);
  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);
  const shelfmark = `${locationLabel ?? ''} ${locationShelfmark ?? ''}`;

  if (locationId !== 'on-order') {
    return [
      // We don't want to display items that are on order in a table, we just show the location label
      item.title || ' ',
      shelfmark,
      accessMethodColumn,
      accessStatus,
      accessTerms,
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
  const headerRow = [
    'Title',
    'Location/Shelfmark',
    'Access method',
    'Access status',
    'Access terms',
  ].filter(Boolean);
  const bodyRows = createBodyRows(physicalItems, encoreLink);

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
      {Boolean(bodyRows.length) && (
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <Table
            hasRowHeaders={false}
            rows={[headerRow, ...bodyRows]}
            vAlign="middle"
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
