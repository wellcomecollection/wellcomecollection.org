import { NextPage } from 'next';
import { ReactElement } from 'react';

import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { gridSize12 } from '@weco/common/views/components/Layout';
import Body from '@weco/content/views/components/Body';
import ThematicBrowsingLayout, {
  ThematicBrowsingCategoryPageProps as Props,
} from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsSubjectsPage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = ({ thematicBrowsingPage, bodySliceContexts }) => {
  return (
    <Body
      untransformedBody={thematicBrowsingPage.untransformedBody}
      pageId={thematicBrowsingPage.id}
      pageUid={thematicBrowsingPage.uid}
      gridSizes={gridSize12()}
      bodySliceContexts={{ ...bodySliceContexts, themeCardCols: 3 }}
    />
  );
};

CollectionsSubjectsPage.getLayout = page => {
  return (
    <ThematicBrowsingLayout
      page={page.props.thematicBrowsingPage}
      apiToolbarLinks={[createPrismicLink(page.props.thematicBrowsingPage.id)]}
      currentCategory="subjects"
      jsonLd={page.props.jsonLd}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default CollectionsSubjectsPage;
