import { NextPage } from 'next';
import { ReactElement } from 'react';

import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { gridSize12 } from '@weco/common/views/components/Layout';
import { Page } from '@weco/content/types/pages';
import Body from '@weco/content/views/components/Body';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';

export type Props = {
  thematicBrowsingPage: Page;
};

const CollectionsPeoplePage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({ thematicBrowsingPage }) => {
  return (
    <Body
      untransformedBody={thematicBrowsingPage.untransformedBody}
      pageId={thematicBrowsingPage.id}
      pageUid={thematicBrowsingPage.uid}
      gridSizes={gridSize12()}
    />
  );
};

CollectionsPeoplePage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      page={page.props.thematicBrowsingPage}
      apiToolbarLinks={[createPrismicLink(page.props.thematicBrowsingPage.id)]}
      currentCategory="people-and-organisations"
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsPeoplePage;
