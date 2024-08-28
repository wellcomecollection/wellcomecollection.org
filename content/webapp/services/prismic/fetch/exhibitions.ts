import {
  clientSideFetcher,
  fetcher,
  fetchFromClientSide,
  GetServerSidePropsPrismicClient,
} from '.';
import { ExhibitionRelatedContentPrismicDocument } from '@weco/content/services/prismic/types';
import {
  ExhibitionsDocument as RawExhibitionsDocument,
  PagesDocument as RawPagesDocument,
  VisualStoriesDocument as RawVisualStoriesDocument,
} from '@weco/common/prismicio-types';
import { fetchPages } from './pages';
import { fetchVisualStories } from './visual-stories';
import { fetchExhibitionGuides } from '@weco/content/services/prismic/fetch/exhibition-guides';
import { fetchExhibitionTexts } from '@weco/content/services/prismic/fetch/exhibition-texts';
import { fetchExhibitionHighlightTours } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import * as prismic from '@prismicio/client';
import { eventAccessOptionsFields } from '../fetch-links';
import { Period } from '@weco/common/types/periods';
import { getExhibitionPeriodFilters } from '../types/filters';
import {
  Exhibition,
  ExhibitionRelatedContent,
} from '@weco/content/types/exhibitions';
import {
  articleFormatsFetchLinks,
  audienceFetchLinks,
  contributorFetchLinks,
  eventSeriesFetchLinks,
  exhibitionFormatsFetchLinks,
  exhibitionsFetchLinks,
  seasonsFetchLinks,
  articlesFetchLinks,
  seriesFetchLinks,
  eventFormatFetchLinks,
  eventPolicyFetchLinks,
  eventsFetchLinks,
  interpretationTypeFetchLinks,
  teamsFetchLinks,
  placesFetchLinks,
} from '../types';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';

const fetchLinks = [
  ...exhibitionFormatsFetchLinks,
  ...exhibitionsFetchLinks,
  ...contributorFetchLinks,
  ...placesFetchLinks,
  ...eventSeriesFetchLinks,
  ...articlesFetchLinks,
  ...eventsFetchLinks,
  ...seasonsFetchLinks,
] as string[];

const exhibitionsFetcher = fetcher<RawExhibitionsDocument>(
  'exhibitions',
  fetchLinks
);

function returnEmptyResults() {
  return {
    page: 1,
    results_per_page: 20,
    results_size: 0,
    total_results_size: 0,
    total_pages: 0,
    next_page: null,
    prev_page: null,
    results: [],
    version: '',
    license: '',
  };
}

export type FetchExhibitionResult = {
  exhibition?: RawExhibitionsDocument;
  pages: prismic.Query<RawPagesDocument>;
  visualStories: prismic.Query<RawVisualStoriesDocument>;
  allGuides: {
    id: string;
    type: string;
  }[];
};

export async function fetchExhibition(
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<FetchExhibitionResult> {
  const exhibitionDocumentById = await exhibitionsFetcher.getById(client, id);
  const exhibitionDocumentByUID = await exhibitionsFetcher.getByUid(client, id);

  // TODO once redirects are in place we should only fetch by uid
  const exhibitionDocument = exhibitionDocumentById || exhibitionDocumentByUID;

  const pageQueryPromise = fetchPages(client, {
    filters: [prismic.filter.at('my.pages.parents.parent', id)],
  });

  const visualStoriesQueryPromise = fetchVisualStories(client, {
    filters: [prismic.filter.at('my.visual-stories.relatedDocument', id)],
  });
  const exhibitionGuidesQueryPromise = fetchExhibitionGuides(client, {
    filters: [prismic.filter.at('my.exhibition-guides.related-exhibition', id)],
  });

  const exhibitionTextsQueryPromise = fetchExhibitionTexts(client, {
    filters: [prismic.filter.at('my.exhibition-texts.related_exhibition', id)],
  }).catch(returnEmptyResults);

  const exhibitionHighlightToursQueryPromise = fetchExhibitionHighlightTours(
    client,
    {
      filters: [
        prismic.filter.at(
          'my.exhibition-highlight-tours.related_exhibition',
          id
        ),
      ],
    }
  ).catch(returnEmptyResults);

  const [
    pages,
    visualStories,
    exhibitionGuidesQuery,
    exhibitionTextsQuery,
    exhibitionHighlightToursQuery,
  ] = await Promise.all([
    pageQueryPromise,
    visualStoriesQueryPromise,
    exhibitionGuidesQueryPromise,
    exhibitionTextsQueryPromise,
    exhibitionHighlightToursQueryPromise,
  ]);

  // The exhibitionTexts and exhibitionHighlightTours can belong to the same
  // exhibition, but we only want to provide one link to the guide index page,
  // so we merge the ones with the same related_exhibition id.
  // We also want to include the deprecated ExhibitionGuides.
  const allGuides = [
    ...new Map(
      [
        ...exhibitionTextsQuery.results,
        ...exhibitionHighlightToursQuery.results,
      ].map(item => {
        const relatedExhibition = isFilledLinkToDocument(
          item.data.related_exhibition
        )
          ? item.data.related_exhibition
          : undefined;
        return [relatedExhibition?.id, item];
      })
    ).values(),
    ...exhibitionGuidesQuery.results,
  ].map(guide => ({
    id: guide.id,
    type: guide.type,
  }));

  return {
    exhibition: exhibitionDocument,
    pages,
    visualStories,
    allGuides,
  };
}

const startField = 'my.exhibitions.start';
const endField = 'my.exhibitions.end';

type Order = 'desc' | 'asc';
type GetExhibitionsProps = {
  filters?: string[];
  order?: Order;
  period?: Period;
  page?: number;
};

export const fetchExhibitions = (
  client: GetServerSidePropsPrismicClient,
  { filters = [], order = 'desc', period, page = 1 }: GetExhibitionsProps = {}
): Promise<prismic.Query<RawExhibitionsDocument>> => {
  const orderings: prismic.Ordering[] = [
    { field: 'my.exhibitions.isPermanent', direction: 'desc' },
    { field: endField, direction: order },
  ];

  const periodFilters = period
    ? getExhibitionPeriodFilters({ period, startField, endField })
    : [];

  return exhibitionsFetcher.getByType(client, {
    filters: [...filters, ...periodFilters],
    orderings,
    page,
  });
};

const fetchExhibitionsClientSide =
  clientSideFetcher<Exhibition>('exhibitions').getByTypeClientSide;

export const fetchExhibitExhibition = async (
  exhibitId: string
): Promise<Exhibition | undefined> => {
  const filters = [
    prismic.filter.at('my.exhibitions.exhibits.item', exhibitId),
  ];

  const response = await fetchExhibitionsClientSide({ filters });

  return response && response.results.length > 0
    ? response.results[0]
    : undefined;
};

export const fetchExhibitionRelatedContent = async (
  { client }: GetServerSidePropsPrismicClient,
  ids: string[]
): Promise<prismic.Query<ExhibitionRelatedContentPrismicDocument>> => {
  const fetchLinks = [
    ...eventAccessOptionsFields,
    ...teamsFetchLinks,
    ...eventFormatFetchLinks,
    ...placesFetchLinks,
    ...interpretationTypeFetchLinks,
    ...audienceFetchLinks,
    ...contributorFetchLinks,
    ...eventSeriesFetchLinks,
    ...eventPolicyFetchLinks,
    ...seriesFetchLinks,
    ...articleFormatsFetchLinks,
    ...exhibitionFormatsFetchLinks,
    ...exhibitionsFetchLinks,
    ...articlesFetchLinks,
  ] as string[];

  return client.getByIDs<ExhibitionRelatedContentPrismicDocument>(ids, {
    fetchLinks,
  });
};

export const fetchExhibitionRelatedContentClientSide = async (
  ids: string[]
): Promise<ExhibitionRelatedContent | undefined> => {
  return fetchFromClientSide<ExhibitionRelatedContent>({
    endpoint: 'exhibitions-related-content',
    params: ids,
  });
};
