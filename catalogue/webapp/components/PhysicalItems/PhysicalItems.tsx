import { FunctionComponent } from 'react';
import { PhysicalItem } from '@weco/common/model/catalogue';
import Table from '@weco/common/views/components/Table/Table';
import Space from '@weco/common/views/components/styled/Space';

type Props = { items: PhysicalItem[] };
const PhysicalItems: FunctionComponent<Props> = ({ items }: Props) => {
  const headerRow = ['Title', 'Location/Shelfmark'];
  const bodyRows = items.map(item => {
    return [
      item.title || 'unknown',
      (function() {
        const physicalLocation = item.locations.find(
          location => location.type === 'PhysicalLocation'
        );
        return physicalLocation ? physicalLocation.label : '';
      })(),
    ];
  });

  return (
    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
      <Table hasRowHeaders={false} rows={[headerRow, ...bodyRows]} />
      <pre
        style={{
          maxWidth: '600px',
          margin: '0 auto 24px',
          fontSize: '14px',
        }}
      >
        <code
          style={{
            display: 'block',
            padding: '24px',
            backgroundColor: '#EFE1AA',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '6px',
          }}
        >
          {JSON.stringify(items, null, 1)}
        </code>
      </pre>
    </Space>
  );
};

export default PhysicalItems;
