import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { getServerData } from '@weco/common/server-data';
import { useToggles } from '@weco/common/server-data/Context';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import SearchForm from '@weco/common/views/components/SearchForm';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsLandingPage from '@weco/content/views/pages/collections';

const Page: NextPage<page.Props> = props => {
  const { collectionsLanding } = useToggles();

  return collectionsLanding ? (
    <CollectionsLandingPage {...props} />
  ) : (
    <page.Page
      {...props}
      staticContent={
        <ContaineredLayout gridSizes={gridSize12()}>
          <SpacingSection>
            <SearchForm searchCategory="works" location="page" />
          </SpacingSection>
        </ContaineredLayout>
      }
    />
  );
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const newCollectionsLanding = serverData.toggles.collectionsLanding.value;

  return page.getServerSideProps({
    ...context,
    query: {
      pageId: newCollectionsLanding
        ? prismicPageIds.newCollections
        : prismicPageIds.collections,
    },
    params: { siteSection: 'collections' },
  });
};
export default Page;
