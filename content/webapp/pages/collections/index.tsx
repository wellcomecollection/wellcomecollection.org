import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import {
  PagesDocumentDataBodySlice,
  FullWidthBannerSlice as RawFullWidthBannerSlice,
  PagesDocument as RawPagesDocument,
  TextSlice as RawTextSlice,
  ThemeCardsListSlice as RawThemeCardsListSlice,
} from '@weco/common/prismicio-types';
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
import {
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
    prismicPageIds.collections
  );

  if (isNotUndefined(collectionsPagePromise)) {
    const collectionsPage = transformPage(
      collectionsPagePromise as RawPagesDocument
    );

    const insideOurCollectionsCards =
      getInsideOurCollectionsCards(collectionsPage);

    const bannerOne = collectionsPage.untransformedBody.find(
      (slice: prismic.Slice) => slice.slice_type === 'fullWidthBanner'
    ) as RawFullWidthBannerSlice | undefined;

    const bannerTwo = collectionsPage.untransformedBody.find(
      (slice: prismic.Slice) =>
        slice.slice_type === 'fullWidthBanner' && slice.id !== bannerOne?.id
    ) as RawFullWidthBannerSlice | undefined;

    const fullWidthBanners = [bannerOne, bannerTwo]
      .filter(isNotUndefined)
      .filter(isFullWidthBanner);

    const themeCardsListSlices = collectionsPage.untransformedBody.filter(
      (slice: PagesDocumentDataBodySlice) =>
        slice.slice_type === 'themeCardsList'
    ) as RawThemeCardsListSlice[] | undefined;

    let newOnlineDocuments: WorkBasic[] = [];

    // Find the "New online" text block in Prismic that contains work IDs
    // Format should be: "New online: [ptfqa2te, bbsjt2ex, a3cyqwec, sh37yy5n]"
    const newOnlineBlock = collectionsPage.untransformedBody.find(
      (slice: prismic.Slice) =>
        slice.slice_type === 'text' &&
        Array.isArray(slice.primary.text) &&
        slice.primary.text.some((block: prismic.RTParagraphNode) =>
          block.text.includes('New online:')
        )
    ) as RawTextSlice | undefined;

    const firstNode = newOnlineBlock?.primary.text?.[0];
    const newOnlineBlockText =
      firstNode && 'text' in firstNode ? firstNode.text : undefined;

    // Extract work IDs from square brackets
    const match = newOnlineBlockText?.match(/\[(.*?)\]/);
    const newOnlineWorkIds: string[] = match
      ? match[1].split(',').map(id => id.trim())
      : [];

    // Fetch work details for all "New online" IDs
    if (newOnlineWorkIds.length > 0) {
      try {
        const works = await getWorks({
          params: {
            identifiers: newOnlineWorkIds,
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
          prismicId: collectionsPage.id,
          image: collectionsPage.promo?.image,
          description: collectionsPage.promo?.caption,
        },
        title: collectionsPage.title,
        introText: collectionsPage.introText ?? [],
        insideOurCollectionsCards,
        fullWidthBanners,
        themeCardsListSlices: themeCardsListSlices || [],
        newOnlineDocuments,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default Page;
