import { FunctionComponent, ReactElement } from 'react';
import { PhysicalItem } from '@weco/common/model/catalogue';
import Table from '@weco/common/views/components/Table/Table';
import Space from '@weco/common/views/components/styled/Space';
import {
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/common/utils/works';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';

function isRequestableByLocation(id: string): boolean {
  return Boolean(id !== 'on-exhibition' && id !== 'open-shelves');
}

function isRequestableByAccessCondition(id: string): boolean {
  return Boolean(id !== 'by-appointment' && id !== 'restricted');
}

function getFirstPhysicalLocation(item) {
  // In practice we only expect one physical location per item
  return item.locations.find(location => location.type === 'PhysicalLocation');
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
      /* status, TODO status requires item API */
      shelfmark,
      isRequestableByLocation(locationId) &&
      isRequestableByAccessCondition(accessId) &&
      encoreLink ? (
        <ButtonOutlinedLink text="Request item" link={encoreLink} />
      ) : (
        accessLabel || physicalLocation?.locationType.label
      ),
      item.title || 'n/a',
    ];
  }
}

function createBodyRows(items, encoreLink) {
  return items.map(item => createBodyRow(item, encoreLink)).filter(Boolean);
}

type Props = { items: PhysicalItem[]; encoreLink?: string };
const PhysicalItems: FunctionComponent<Props> = ({
  items,
  encoreLink,
}: Props) => {
  const headerRow = [/* 'Status', */ 'Location/Shelfmark', 'Access', 'Title']; // TODO status requires item API
  const bodyRows = createBodyRows(items, encoreLink);

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

  return (
    <>
      {Boolean(bodyRows.length) && (
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <Table hasRowHeaders={false} rows={[headerRow, ...bodyRows]} />
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
