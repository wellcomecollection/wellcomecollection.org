import {
  PagesDocumentDataBodySlice,
  ContentListSlice as RawContentListSlice,
  PagesDocument as RawPagesDocument,
  ThemeCardsListSlice as RawThemeCardsListSlice,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryPropertyValue } from '@weco/common/utils/search';
import { getQueryResults } from '@weco/common/utils/search';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { getConcept } from '@weco/content/services/wellcome/catalogue/concepts';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  toWorkBasic,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { Article } from '@weco/content/types/articles';
import {
  allRecordsLinkParams,
  queryParams,
} from '@weco/content/utils/concepts';
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

    /** Archives
     * TODO
     */

    /**
     * Images and Works
     * */
    const MOCK_CONCEPT_ID = 'patspgf3';
    const conceptResponse = await getConcept({
      id: MOCK_CONCEPT_ID,
      toggles: serverData.toggles,
    });

    if (conceptResponse.type === 'Error') {
      if (conceptResponse.httpStatus === 404) {
        return { notFound: true };
      }
      return appError(
        context,
        conceptResponse.httpStatus,
        conceptResponse.description
      );
    }

    const getConceptDocs = {
      works: {
        byId: (sectionName: string) =>
          getWorks({
            params: queryParams(sectionName, conceptResponse),
            toggles: serverData.toggles,
            pageSize: 5,
          }),
        byLabel: (sectionName: string) =>
          getWorks({
            params: {
              ...allRecordsLinkParams(sectionName, conceptResponse),
              aggregations: ['workType'],
            },
            toggles: serverData.toggles,
            pageSize: 5,
          }),
      },
      images: {
        byId: (sectionName: string) =>
          getImages({
            params: queryParams(sectionName, conceptResponse),
            toggles: serverData.toggles,
            pageSize: 12,
          }),
        byLabel: (sectionName: string) =>
          getImages({
            params: allRecordsLinkParams(sectionName, conceptResponse),
            toggles: serverData.toggles,
            pageSize: 12,
          }),
      },
    };

    const worksAboutPromiseById = getConceptDocs.works.byId('worksAbout');
    const imagesAboutPromiseById = getConceptDocs.images.byId('imagesAbout');

    const worksAboutPromiseByLabel = getConceptDocs.works.byLabel('worksAbout');
    const imagesAboutPromiseByLabel =
      getConceptDocs.images.byLabel('imagesAbout');

    const [
      worksAboutResponseById,
      imagesAboutResponseById,

      worksAboutResponseByLabel,
      imagesAboutResponseByLabel,
    ] = await Promise.all([
      worksAboutPromiseById,
      imagesAboutPromiseById,

      worksAboutPromiseByLabel,
      imagesAboutPromiseByLabel,
    ]);

    const worksAbout = getQueryResults({
      categoryName: 'works about',
      queryResults: worksAboutResponseById,
    });
    const imagesAbout = getQueryResults({
      categoryName: 'images about',
      queryResults: imagesAboutResponseById,
    });

    const getLabelTotals = () => {
      const worksAboutByLabelTotalResults = getQueryResults({
        categoryName: 'works about',
        queryResults: worksAboutResponseByLabel,
      })?.totalResults;
      const imagesAboutByLabelTotalResults = getQueryResults({
        categoryName: 'images about',
        queryResults: imagesAboutResponseByLabel,
      })?.totalResults;

      return {
        worksAbout: worksAboutByLabelTotalResults,
        imagesAbout: imagesAboutByLabelTotalResults,
      };
    };

    const totalResults = getLabelTotals();

    const apiToolbarLinks = [
      {
        id: 'json',
        label: 'JSON',
        link: `https://api.wellcomecollection.org/catalogue/v2/concepts/${MOCK_CONCEPT_ID}`,
      },
    ];

    const worksAndImagesAbout = {
      ...(worksAbout && {
        works: {
          ...worksAbout,
          pageResults: worksAbout.pageResults.map(toWorkBasic),
          workTypes:
            ('aggregations' in worksAboutResponseByLabel &&
              worksAboutResponseByLabel.aggregations?.workType?.buckets.map(
                bucket => ({ label: bucket.data.label, count: bucket.count })
              )) ||
            [],
        },
      }),
      images: imagesAbout,
      totalResults: {
        works: totalResults.worksAbout,
        images: totalResults.imagesAbout,
      },
    };
    console.log(worksAndImagesAbout.works);
    /** */

    return {
      props: serialiseProps<Props>({
        serverData,
        apiToolbarLinks,
        thematicBrowsingPage: wellcomeSubThemePage,
        categoryThemeCardsList: themeCardsListSlice,
        curatedUid: pageUid,
        newOnlineWorks: newOnlineWorks.map(toWorkBasic),
        relatedStories,
        worksAndImagesAbout,
        relatedTopics: conceptResponse.relatedConcepts?.relatedTopics || [],
      }),
    };
  }

  return { notFound: true };
};

export default WellcomeSubThemePage;
