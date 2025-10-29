import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { getInsideOurCollectionsCards } from '@weco/content/services/prismic/transformers/collections-landing';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { getConcepts } from '@weco/content/services/wellcome/catalogue/concepts';
import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { isFullWidthBanner } from '@weco/content/types/body';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsLandingPage, {
  Props as CollectionsLandingPageProps,
} from '@weco/content/views/pages/collections';
import { themeBlockCategories } from '@weco/content/views/pages/collections/themeBlockCategories';

export type ThemeCategory = {
  label: string;
  concepts: string[];
};

export async function getConceptsByIds(ids: string[]): Promise<Concept[]> {
  if (!ids || ids.length === 0) return [];

  const result = await getConcepts({
    params: { id: ids.join(',') },
    toggles: {},
  });

  if ('results' in result) return result.results;

  return [];
}

async function fetchFeaturedConcepts(): Promise<Concept[]> {
  try {
    const featuredCategory = themeBlockCategories.categories.find(
      (category: ThemeCategory) => category.label === 'Featured'
    );

    if (!featuredCategory || !featuredCategory.concepts) {
      console.warn('No featured category found in theme config');
      return [];
    }

    return getConceptsByIds(featuredCategory.concepts);
  } catch (error) {
    console.error('Error fetching featured concepts:', error);
    return [];
  }
}

const Page: NextPage<CollectionsLandingPageProps> = props => {
  return <CollectionsLandingPage {...props} />;
};

type Props = ServerSideProps<CollectionsLandingPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const client = createClient(context);
  const collectionsPagePromise = await fetchPage(
    client,
    prismicPageIds.newCollections
  );

  if (isNotUndefined(collectionsPagePromise)) {
    const collectionsPage = transformPage(
      collectionsPagePromise as RawPagesDocument
    );

    const insideOurCollectionsCards =
      getInsideOurCollectionsCards(collectionsPage);

    // Fetch featured concepts for the theme block
    const featuredConcepts = await fetchFeaturedConcepts();

    const bannerOne = collectionsPage.untransformedBody.find(
      slice => slice.slice_type === 'fullWidthBanner'
    );

    const bannerTwo = collectionsPage.untransformedBody.find(
      slice =>
        slice.slice_type === 'fullWidthBanner' && slice.id !== bannerOne?.id
    );

    const fullWidthBanners = [bannerOne, bannerTwo]
      .filter(isNotUndefined)
      .filter(isFullWidthBanner);

    return {
      props: serialiseProps({
        pageMeta: {
          id: collectionsPage.id,
          image: collectionsPage.promo?.image,
          description: collectionsPage.promo?.caption,
        },
        title: collectionsPage.title,
        introText: collectionsPage.introText ?? [],
        insideOurCollectionsCards,
        featuredConcepts,
        fullWidthBanners,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default Page;
