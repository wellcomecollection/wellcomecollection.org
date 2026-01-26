import { NextPage } from 'next';
import { ReactElement } from 'react';

import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';
import { CollectionsStaticPageMeta } from '@weco/content/views/layouts/ThematicBrowsingLayout';

export type Props = {
  title: string;
  description: string;
  pageMeta: CollectionsStaticPageMeta;
};

const CollectionsTypesAndTechniquesPage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
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
  const { title, description, pageMeta } = page.props;
  return (
    <ThematicBrowsingLayout
      title={title}
      description={description}
      pageMeta={pageMeta}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsTypesAndTechniquesPage;
