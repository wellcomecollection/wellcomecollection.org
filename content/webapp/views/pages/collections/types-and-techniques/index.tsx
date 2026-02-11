import { NextPage } from 'next';
import { ReactElement } from 'react';

import { font } from '@weco/common/utils/classnames';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { useCollectionStats } from '@weco/content/hooks/useCollectionStats';
import { Page } from '@weco/content/types/pages';
import Body from '@weco/content/views/components/Body';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';
import WorkTypesList from '@weco/content/views/pages/collections/collections.WorkTypesList';

export type Props = {
  thematicBrowsingPage: Page;
};

const CollectionsTypesPage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({ thematicBrowsingPage }) => {
  const { data: collectionStats } = useCollectionStats();

  return (
    <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'lg', properties: ['margin-bottom'] }}>
          <h2 className={font('sans-bold', 2)}>
            Types of materials in the collections
          </h2>
        </Space>

        <WorkTypesList collectionStats={collectionStats} />
      </ContaineredLayout>

      <Body
        untransformedBody={thematicBrowsingPage.untransformedBody}
        pageId={thematicBrowsingPage.id}
        pageUid={thematicBrowsingPage.uid}
        gridSizes={gridSize12()}
      />
    </Space>
  );
};

CollectionsTypesPage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      page={page.props.thematicBrowsingPage}
      apiToolbarLinks={[createPrismicLink(page.props.thematicBrowsingPage.id)]}
      currentCategory="types-and-techniques"
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsTypesPage;
