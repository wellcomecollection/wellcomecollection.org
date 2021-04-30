import { FunctionComponent } from 'react';
import { PhysicalItem } from '@weco/common/model/catalogue';
import Table from '@weco/common/views/components/Table/Table';
import Space from '@weco/common/views/components/styled/Space';
import {
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/common/utils/works';

type Props = { items: PhysicalItem[] };
const PhysicalItems: FunctionComponent<Props> = ({ items }: Props) => {
  const headerRow = ['Title', 'Location', 'Shelfmark'];
  const bodyRows = items.map(item => {
    const physicalLocations = item.locations.filter(
      location => location.type === 'PhysicalLocation'
    );
    const locationText = physicalLocations
      .map(location => {
        return `${location.locationType.label ?? ''}`;
      })
      .join(', ');
    const shelfmark = physicalLocations
      .map(location => {
        const locationLabel = getLocationLabel(location);
        const locationShelfmark = getLocationShelfmark(location);
        return `${locationLabel ?? ''} ${locationShelfmark ?? ''}`;
      })
      .join(', ');
    return [item.title || 'unknown', locationText, shelfmark];
  });

  return (
    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
      <Table hasRowHeaders={false} rows={[headerRow, ...bodyRows]} />
    </Space>
  );
};

export default PhysicalItems;
