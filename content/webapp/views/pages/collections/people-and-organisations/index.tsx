import { NextPage } from 'next';
import { ReactElement } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsPeoplePage: NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
} = () => {
  return (
    <Container>
      <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
        <p>People and organisations content</p>
      </Space>
    </Container>
  );
};

CollectionsPeoplePage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      title="People and organisations" // TODO confirm
      description={pageDescriptions.collections.peopleAndOrganisations}
      pageMeta={{
        urlPathname: '/people-and-organisations',
      }}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsPeoplePage;
