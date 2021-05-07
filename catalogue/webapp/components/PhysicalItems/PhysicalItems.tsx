import { FunctionComponent } from 'react';
import { PhysicalItem } from '@weco/common/model/catalogue';
import Table from '@weco/common/views/components/Table/Table';
import Space from '@weco/common/views/components/styled/Space';
import {
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/common/utils/works';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';

type Props = { items: PhysicalItem[]; encoreLink?: string };
const PhysicalItems: FunctionComponent<Props> = ({
  items,
  encoreLink,
}: Props) => {
  const headerRow = ['Title', 'Location', 'Shelfmark', 'Access'];
  const bodyRows = items.map(item => {
    const physicalLocation = item.locations.find(
      // in practice we only expect one physical location per item
      location => location.type === 'PhysicalLocation'
    );
    const locationText = physicalLocation?.locationType.label ?? '';
    const locationLabel =
      physicalLocation && getLocationLabel(physicalLocation);
    const locationShelfmark =
      physicalLocation && getLocationShelfmark(physicalLocation);
    const shelfmark = `${locationLabel ?? ''} ${locationShelfmark ?? ''}`;

    return [
      item.title || 'unknown',
      locationText,
      shelfmark,
      locationText !== 'Open shelves' && encoreLink ? (
        <ButtonOutlinedLink text="Request this item" link={encoreLink} />
      ) : (
        'Open shelves'
      ),
    ];
  });

  return (
    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
      <Table hasRowHeaders={false} rows={[headerRow, ...bodyRows]} />
    </Space>
  );
};

export default PhysicalItems;
