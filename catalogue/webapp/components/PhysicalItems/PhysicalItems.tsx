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
  const bodyRows = items.map(item => {
    const physicalLocation = getFirstPhysicalLocation(item);
    const locationText = physicalLocation?.locationType.label ?? '';
    const locationLabel =
      physicalLocation && getLocationLabel(physicalLocation);
    const locationShelfmark =
      physicalLocation && getLocationShelfmark(physicalLocation);
    const shelfmark = `${locationLabel ?? ''} ${locationShelfmark ?? ''}`;
    const accessLabel =
      physicalLocation?.accessConditions[0].status.label ?? '';

    // TODO clarify difference between locationLabel and locationText and which we should be using
    return [
      /* status, TODO status requires item API */
      shelfmark,
      locationText !== 'Open shelves' &&
      accessLabel !== 'By appointment' && // TODO question: are there other circumstances where we don't want the encore link?
      encoreLink ? (
        <ButtonOutlinedLink text="Request this item" link={encoreLink} />
      ) : (
        accessLabel
      ),
      item.title || 'unknown',
    ];
  });

  const accessCondtionsTerms = items
    .map(item => {
      // TODO question: we're displaying accessConditions below the table, as per design, but need to check how this will work if we have multiple items with access conditions - design only really works for one such item.

      const physicalLocation = getFirstPhysicalLocation(item);
      return physicalLocation?.accessConditions[0].terms ?? null; // TODO question: in practice we only expect one access condition per item, is this true?
    })
    .filter(Boolean);

  return (
    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
      <Table hasRowHeaders={false} rows={[headerRow, ...bodyRows]} />
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
    </Space>
  );
};

export default PhysicalItems;
