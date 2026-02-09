import * as prismic from '@prismicio/client';
import { NextPage } from 'next';
import { ReactElement } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { gridSize12 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { Page } from '@weco/content/types/pages';
import Body from '@weco/content/views/components/Body';
import { CollectionsPrismicPageMeta } from '@weco/content/views/layouts/ThematicBrowsingLayout';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

export type Props = {
  thematicBrowsingPage: Page;
  title: string;
  introText: prismic.RichTextField; // TODO?
  pageMeta: CollectionsPrismicPageMeta;
};

const CollectionsPlacesPage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({ thematicBrowsingPage }) => {
  return (
    <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
      <Body
        untransformedBody={thematicBrowsingPage.untransformedBody}
        pageId={thematicBrowsingPage.id}
        pageUid={thematicBrowsingPage.uid}
        gridSizes={gridSize12()}
      />
    </Space>
  );
};

CollectionsPlacesPage.getLayout = page => {
  const { pageMeta, title } = page.props;

  return (
    <ThematicBrowsingLayout
      title={title}
      description={pageMeta.description || pageDescriptions.collections.index}
      pageMeta={pageMeta}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsPlacesPage;
