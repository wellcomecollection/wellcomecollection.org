import { thematicBrowsingPaths } from '@weco/common/data/hardcoded-ids';
import {
  PagesDocumentDataBodySlice,
  ContentListSlice as RawContentListSlice,
  PagesDocument as RawPagesDocument,
  ThemeCardsListSlice as RawThemeCardsListSlice,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { addDays, today } from '@weco/common/utils/dates';
import { formatIso8601Date } from '@weco/common/utils/format-date';
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
import { genericPageLd } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { getConcepts } from '@weco/content/services/wellcome/catalogue/concepts';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  RelatedConcept,
  toWorkBasic,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import WellcomeSubThemePage, {
  Props as WellcomeSubThemePageProps,
} from '@weco/content/views/pages/collections/subjects/sub-theme';

type Props = ServerSideProps<WellcomeSubThemePageProps>;

// We are hand-selecting concept ids for each subject page
// so we can show results for multiple related concepts
const CONCEPT_GROUPS: Record<string, string[]> = {
  'medicine-care-and-treatment': ['hvngn3u7', 'raz92g59'],
  'sex-sexual-health-and-reproduction': [
    'brm4ha66',
    'bmfun6aj',
    'gynqvms7',
    'bn2pe2v6',
  ],
  'public-health': [
    'c8q553d2',
    'hqbh7xar',
    'c3br959t',
    'h72fhc38',
    'vsnwvu9k',
    'eg8kmtpb',
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
    !(
      serverData.toggles.thematicBrowsing.value &&
      serverData.toggles.thematicBrowsingSubCategory.value
    ) ||
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

  // We want to show works that have been made available online from 00:01 yesterday
  // as some works require more time to properly build and we got errors in the past
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/12787
  const yesterday = formatIso8601Date(addDays(today(), -1));
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
      'items.locations.createdDate.to': yesterday,
      sort: 'items.locations.createdDate',
      sortOrder: 'desc',
    },
    pageSize: 3,
    toggles: serverData.toggles,
  });

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

    const displayLabels = conceptResponse.results.map(c => c.displayLabel);

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
              'subjects.label': displayLabels,
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
              'source.subjects.label': conceptResponse.results.map(
                c => c.label
              ),
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
          totalResults: totalResults.worksAbout ?? worksAbout.totalResults,
          workTypes:
            ('aggregations' in worksAboutResponseByLabel &&
              worksAboutResponseByLabel.aggregations?.workType?.buckets.map(
                bucket => ({
                  id: bucket.data.id,
                  label: bucket.data.label,
                  count: bucket.count,
                })
              )) ||
            [],
        },
      }),
      ...(imagesAbout && {
        images: {
          ...imagesAbout,
          totalResults: totalResults.imagesAbout ?? imagesAbout.totalResults,
        },
      }),
      displayLabels,
    };
    /** */

    /**
     * Frequent collaborators
     * Deduplicate collaborators across multiple concepts by using a Map
     * keyed by collaborator id, then convert back to an array
     * */
    // Typed Map for type safety
    const frequentCollaboratorsMap = new Map<string, RelatedConcept>();
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
     * Round-robin through concepts: take 1st topic from each, then 2nd from each, etc.
     * */
    const relatedTopicsSet = new Set<string>();
    const relatedTopics: RelatedConcept[] = [];
    const conceptTopics = conceptResponse.results.map(
      c => c.relatedConcepts?.relatedTopics || []
    );

    const MAX_RELATED_TOPICS = 16;
    const maxTopics = Math.max(...conceptTopics.map(t => t.length));

    for (
      let i = 0;
      i < maxTopics && relatedTopics.length < MAX_RELATED_TOPICS;
      i++
    ) {
      for (const topics of conceptTopics) {
        if (
          topics[i] &&
          !relatedTopicsSet.has(topics[i].id) &&
          relatedTopics.length < MAX_RELATED_TOPICS
        ) {
          relatedTopicsSet.add(topics[i].id);
          relatedTopics.push(topics[i]);
        }
      }
    }
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
        jsonLd: genericPageLd({
          page: wellcomeSubThemePage,
          canonicalUrl: `${thematicBrowsingPaths.subjects}/${pageUid}`,
        }),
      }),
    };
  }

  return { notFound: true };
};

export default WellcomeSubThemePage;
