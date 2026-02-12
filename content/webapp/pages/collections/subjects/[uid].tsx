import {
  PagesDocumentDataBodySlice,
  ContentListSlice as RawContentListSlice,
  PagesDocument as RawPagesDocument,
  ThemeCardsListSlice as RawThemeCardsListSlice,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import {
  toWorkBasic,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { Article } from '@weco/content/types/articles';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import WellcomeSubThemePage, {
  Props as WellcomeSubThemePageProps,
} from '@weco/content/views/pages/collections/subjects/sub-theme';

type Props = ServerSideProps<WellcomeSubThemePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  // Ensure this is a valid subject page
  // TODO grow list when "core concepts" are officialised
  const subjectsEnum = ['military-and-war', 'medicine-care-and-treatment'];
  const pageUid = getQueryPropertyValue(context.query.uid);

  if (
    !serverData.toggles.thematicBrowsing.value ||
    !pageUid ||
    !subjectsEnum.includes(pageUid)
  ) {
    return {
      notFound: true,
    };
  }

  const client = createClient(context);
  const wellcomeSubThemePagePromise = await fetchPage(
    client,
    'subjects-' + pageUid
  );

  const newOnlineWorks: Work[] = [];
  const newOnlineWorksQuery = await getWorks({
    params: {
      'subjects.label': ['Pharmacy', 'Veterinary Medicine'],
      availabilities: ['online'],
      // Exclude items that are not openly accessible online
      'items.locations.accessConditions.status': [
        '!open-with-advisory',
        '!restricted',
        '!closed',
      ],
      sort: 'items.locations.createdDate',
      sortOrder: 'desc',
    },
    pageSize: 3,
    toggles: serverData.toggles,
  });

  // TODO ?
  if (newOnlineWorksQuery.type !== 'Error') {
    newOnlineWorks.push(...newOnlineWorksQuery.results);
  }

  if (isNotUndefined(wellcomeSubThemePagePromise)) {
    const wellcomeSubThemePage = transformPage(
      wellcomeSubThemePagePromise as RawPagesDocument
    );

    /**
     * Thematic browsing page body slices
     */
    const themeCardsListSlice = wellcomeSubThemePage.untransformedBody.find(
      (slice: PagesDocumentDataBodySlice) =>
        slice.slice_type === 'themeCardsList'
    ) as RawThemeCardsListSlice | undefined;
    /** */

    /**
     * Related stories
     */
    const contentListSlice = wellcomeSubThemePage.untransformedBody.find(
      (slice: PagesDocumentDataBodySlice) => slice.slice_type === 'contentList'
    ) as RawContentListSlice | undefined;

    const contentListItems = contentListSlice
      ? transformContentListSlice(contentListSlice)?.value.items
      : [];

    const relatedStories: Article[] = contentListItems.filter(
      content => content.type === 'articles'
    ) as Article[];
    /** */

    return {
      props: serialiseProps<Props>({
        serverData,
        thematicBrowsingPage: wellcomeSubThemePage,
        categoryThemeCardsList: themeCardsListSlice,
        curatedUid: pageUid,
        newOnlineWorks: newOnlineWorks.map(toWorkBasic),
        relatedStories,
      }),
    };
  }

  return { notFound: true };
};

export default WellcomeSubThemePage;
