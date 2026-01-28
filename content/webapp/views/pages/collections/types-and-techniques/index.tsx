import { NextPage } from 'next';
import { ReactElement } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsTypesAndTechniquesPage: NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
} = () => {
  return (
    <Container>
      <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
        <p>Types and techniques content</p>
      </Space>
    </Container>
  );
};

CollectionsTypesAndTechniquesPage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      title="Types and techniques" // TODO confirm
      description={pageDescriptions.collections.typesAndTechniques}
      pageMeta={{
        urlPathname: '/types-and-techniques',
      }}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsTypesAndTechniquesPage;
