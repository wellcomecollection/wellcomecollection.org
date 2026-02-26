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
import { getConcepts } from '@weco/content/services/wellcome/catalogue/concepts';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  toWorkBasic,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import WellcomeSubThemePage, {
  Props as WellcomeSubThemePageProps,
} from '@weco/content/views/pages/collections/subjects/sub-theme';

type Props = ServerSideProps<WellcomeSubThemePageProps>;

const CONCEPT_GROUPS: Record<string, string[]> = {
  'medicine-care-and-treatment': ['hvngn3u7', 'raz92g59'],
  'sex-sexual-health-and-reproduction': [
    'brm4ha66',
    'bmfun6aj',
    'gynqvms7',
    'bn2pe2v6',
  ],
};

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  // Ensure this is a valid subject page
  const subjectsEnum = Object.keys(CONCEPT_GROUPS);
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
      subjects: CONCEPT_GROUPS[pageUid],
      availabilities: ['online'],
      // Exclude items that are not openly accessible online
      'items.locations.accessConditions.status': [
        '!open-with-advisory',
        '!restricted',
        '!closed',
      ],
      'items.locations.createdDate.to': '2026-02-18',
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

    const relatedStoriesId = contentListItems
      .filter(content => content.type === 'articles')
      .map(story => story.id)
      .filter(isNotUndefined);
    /** */

    /** Archives
     * TODO
     */

    /**
     * Images and Works
     * */
    const conceptResponse = await getConcepts({
      params: {
        id: CONCEPT_GROUPS[pageUid].join(','),
      },
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

    // Extract all labels from the multiple concepts for label-based queries
    const conceptLabels = conceptResponse.results.map(c => c.label);

    const getConceptDocs = {
      works: {
        byId: () =>
          getWorks({
            params: {
              subjects: CONCEPT_GROUPS[pageUid],
            },
            toggles: serverData.toggles,
            pageSize: 5,
          }),
        byLabel: () =>
          getWorks({
            params: {
              'subjects.label': conceptLabels,
              aggregations: ['workType'],
            },
            toggles: serverData.toggles,
            pageSize: 5,
          }),
      },
      images: {
        byId: () =>
          getImages({
            params: {
              'source.subjects': CONCEPT_GROUPS[pageUid],
            },
            toggles: serverData.toggles,
            pageSize: 12,
          }),
        byLabel: () =>
          getImages({
            params: {
              'source.subjects.label': conceptLabels,
            },
            toggles: serverData.toggles,
            pageSize: 12,
          }),
      },
    };

    const worksAboutPromiseById = getConceptDocs.works.byId();
    const worksAboutPromiseByLabel = getConceptDocs.works.byLabel();
    const imagesAboutPromiseById = getConceptDocs.images.byId();
    const imagesAboutPromiseByLabel = getConceptDocs.images.byLabel();

    const [
      worksAboutResponseById,
      worksAboutResponseByLabel,
      imagesAboutResponseById,
      imagesAboutResponseByLabel,
    ] = await Promise.all([
      worksAboutPromiseById,
      worksAboutPromiseByLabel,
      imagesAboutPromiseById,
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
        link: `https://api.wellcomecollection.org/catalogue/v2/concepts?id=${CONCEPT_GROUPS[pageUid].join(',')}`,
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
    /** */

    /**
     * Frequent collaborators
     * Deduplicate collaborators across multiple concepts by using a Map
     * keyed by collaborator id, then convert back to an array
     * */
    const frequentCollaboratorsMap = new Map();
    conceptResponse.results.forEach(concept => {
      concept.relatedConcepts?.frequentCollaborators?.forEach(collaborator => {
        if (!frequentCollaboratorsMap.has(collaborator.id)) {
          frequentCollaboratorsMap.set(collaborator.id, collaborator);
        }
      });
    });
    const frequentCollaborators = Array.from(frequentCollaboratorsMap.values());
    /** */

    /**
     * Related topics
     * Deduplicate topics across multiple concepts by using a Map
     * keyed by topic id, then convert back to an array
     * */
    const relatedTopicsMap = new Map();
    conceptResponse.results.forEach(concept => {
      concept.relatedConcepts?.relatedTopics?.forEach(topic => {
        if (!relatedTopicsMap.has(topic.id)) {
          relatedTopicsMap.set(topic.id, topic);
        }
      });
    });
    const relatedTopics = Array.from(relatedTopicsMap.values());
    /** */

    return {
      props: serialiseProps<Props>({
        serverData,
        apiToolbarLinks,
        thematicBrowsingPage: wellcomeSubThemePage,
        categoryThemeCardsList: themeCardsListSlice,
        curatedUid: pageUid,
        newOnlineWorks: newOnlineWorks.map(toWorkBasic),
        frequentCollaborators,
        relatedStoriesId,
        worksAndImagesAbout,
        relatedTopics,
      }),
    };
  }

  return { notFound: true };
};

export default WellcomeSubThemePage;
