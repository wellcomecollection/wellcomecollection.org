import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
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
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { getInsideOurCollectionsCards } from '@weco/content/services/prismic/transformers/collections-landing';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsLandingPage, {
  Props as CollectionsLandingPageProps,
} from '@weco/content/views/pages/collections';

const Page: NextPage<
  page.Props | (CollectionsLandingPageProps & { hasNewPageToggle: true })
> = props => {
  return 'hasNewPageToggle' in props ? (
    <CollectionsLandingPage {...props} />
  ) : (
    <page.Page
      {...props}
      staticContent={
        <ContaineredLayout gridSizes={gridSize12()}>
          <SpacingSection>
            <SearchForm
              searchCategory="works"
              location="page"
              showTypewriter={true}
            />
          </SpacingSection>
        </ContaineredLayout>
      }
    />
  );
};

type Props = ServerSideProps<
  page.Props | (CollectionsLandingPageProps & { hasNewPageToggle: true })
>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const client = createClient(context);
  const newCollectionsLanding = serverData.toggles.collectionsLanding.value;

  if (newCollectionsLanding) {
    const collectionsPagePromise = await fetchPage(
      client,
      prismicPageIds.newCollections
    );
    const collectionsPage = transformPage(
      collectionsPagePromise as RawPagesDocument
    );

    const insideOurCollectionsCards =
      getInsideOurCollectionsCards(collectionsPage);

    return {
      props: serialiseProps({
        hasNewPageToggle: true,
        pageMeta: {
          id: collectionsPage.id,
          image: collectionsPage.promo?.image,
          description: collectionsPage.promo?.caption,
        },
        title: collectionsPage.title,
        introText: collectionsPage.introText ?? [],
        insideOurCollectionsCards,
        serverData,
      }),
    };
  }

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
