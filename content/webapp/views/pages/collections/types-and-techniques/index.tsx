import { NextPage } from 'next';

import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { withThematicBrowsingLayout } from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsTypesAndTechniquesPage: NextPage = withThematicBrowsingLayout(
  () => {
    return (
      <Container>
        <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
          <p>Types and techniques content</p>
        </Space>
      </Container>
    );
  }
);

export default CollectionsTypesAndTechniquesPage;
