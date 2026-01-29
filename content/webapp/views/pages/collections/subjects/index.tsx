import { NextPage } from 'next';
import { ReactElement } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsSubjectsPage: NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
} = () => {
  return (
    <Container>
      <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
        Subjects page content
        <ul>
          <li>
            <a href="/collections/subjects/military-and-war">
              Military and war
            </a>
          </li>
        </ul>
      </Space>
    </Container>
  );
};

CollectionsSubjectsPage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      title="Subjects"
      description={pageDescriptions.collections.subjects}
      pageMeta={{
        urlPathname: '/subjects',
      }}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsSubjectsPage;
