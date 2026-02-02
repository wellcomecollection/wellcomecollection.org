import { NextPage } from 'next';
import { ReactElement } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsPlacesPage: NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
} = () => {
  return (
    <Container>
      <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
        <p>Places content</p>
      </Space>
    </Container>
  );
};

CollectionsPlacesPage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      title="Places" // TODO confirm
      description={pageDescriptions.collections.places}
      pageMeta={{
        urlPathname: '/places',
      }}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsPlacesPage;
