import { NextPage } from 'next';
import { ReactElement } from 'react';

import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { gridSize12 } from '@weco/common/views/components/Layout';
import Body from '@weco/content/views/components/Body';
import ThematicBrowsingLayout, {
  ThematicBrowsingCategoryPageProps as Props,
} from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsPlacesPage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({ thematicBrowsingPage, bodySliceContexts }) => {
  return (
    <Body
      untransformedBody={thematicBrowsingPage.untransformedBody}
      pageId={thematicBrowsingPage.id}
      pageUid={thematicBrowsingPage.uid}
      gridSizes={gridSize12()}
      bodySliceContexts={bodySliceContexts}
    />
  );
};

CollectionsPlacesPage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      page={page.props.thematicBrowsingPage}
      apiToolbarLinks={[createPrismicLink(page.props.thematicBrowsingPage.id)]}
      currentCategory="places"
      jsonLd={page.props.jsonLd}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsPlacesPage;
