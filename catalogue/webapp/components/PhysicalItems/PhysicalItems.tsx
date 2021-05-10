import { FunctionComponent } from 'react';
import { PhysicalItem } from '@weco/common/model/catalogue';
import Table from '@weco/common/views/components/Table/Table';
import Space from '@weco/common/views/components/styled/Space';
import {
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/common/utils/works';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';

// TODO question: are there other circumstances where something isn't requestable? // isRequestableByAccessCondition? yedqmmxp
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
type Props = { items: PhysicalItem[]; encoreLink?: string };
const PhysicalItems: FunctionComponent<Props> = ({
  items,
  encoreLink,
}: Props) => {
  const headerRow = [/* 'Status', */ 'Location/Shelfmark', 'Access', 'Title']; // TODO status requires item API
  const bodyRows = items
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

      // TODO clarify difference between locationLabel and locationText and which we should be using
      if (locationId !== 'on-order') {
        return [
          // We don't want to display on order items in a table, we just show the label
          /* status, TODO status requires item API */
          shelfmark,
          // TODO use ids not labels
          isRequestableByLocation(locationId) &&
          isRequestableByAccessCondition(accessId) &&
          encoreLink ? (
            <ButtonOutlinedLink text="Request item" link={encoreLink} />
          ) : (
            accessLabel // TODO or something else?
          ),
          item.title || 'n/a',
        ];
      } else {
        return [];
      }
    })
    .filter(Boolean);

  const accessCondtionsTerms = items
    .map(item => {
      // TODO question: we're displaying accessConditions below the table, as per design, but need to check how this will work if we have multiple items with access conditions - design only really works for one such item.

      const physicalLocation = getFirstPhysicalLocation(item);
      return physicalLocation?.accessConditions[0]?.terms ?? null; // TODO question: in practice we only expect one access condition per item, is this true?
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
    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
      {bodyRows[0] && (
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
