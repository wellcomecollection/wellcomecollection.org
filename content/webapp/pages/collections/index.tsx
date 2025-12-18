import * as prismic from '@prismicio/client';
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
import {
  type Concept,
  toWorkBasic,
  Work,
  type WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
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

    let newOnlineDocuments: WorkBasic[] = [];

    // Find the "New online" text block in Prismic that contains work IDs
    // Format should be: "New online: [ptfqa2te, bbsjt2ex, a3cyqwec, sh37yy5n]"
    const newOnlineBlock = collectionsPage.untransformedBody.find(
      slice =>
        slice.slice_type === 'text' &&
        Array.isArray(slice.primary.text) &&
        slice.primary.text.some((block: prismic.RTParagraphNode) =>
          block.text.includes('New online:')
        )
    )?.primary.text?.[0]?.text;

    // Extract work IDs from square brackets
    const match = newOnlineBlock?.match(/\[(.*?)\]/);
    const newOnlineWorkIds: string[] = match
      ? match[1].split(',').map(id => id.trim())
      : [];

    // Fetch work details for all "New online" IDs
    if (newOnlineWorkIds.length > 0) {
      try {
        const works = await getWorks({
          params: {
            query: newOnlineWorkIds.join(' '),
          },
          toggles: serverData.toggles,
        });

        if (works.type !== 'Error') {
          // Transform and preserve the order from Prismic
          const worksById = new Map(works.results.map(w => [w.id, w]));
          newOnlineDocuments = newOnlineWorkIds
            .map(id => worksById.get(id))
            .filter((work): work is Work => work !== undefined)
            .map(work => toWorkBasic(work));
        }
      } catch (error) {
        console.error('Error fetching new online documents:', error);
      }
    }

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
        newOnlineDocuments,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default Page;
