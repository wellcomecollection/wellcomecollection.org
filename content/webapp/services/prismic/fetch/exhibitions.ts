import {
  clientSideFetcher,
  fetcher,
  fetchFromClientSide,
  GetServerSidePropsPrismicClient,
} from '.';
import {
  ExhibitionPrismicDocument,
  ExhibitionRelatedContentPrismicDocument,
} from '../types/exhibitions';
import { fetchPages } from './pages';
import { fetchVisualStories } from './visual-stories';
import { fetchExhibitionGuides } from '@weco/content/services/prismic/fetch/exhibition-guides';
import { fetchExhibitionTexts } from '@weco/content/services/prismic/fetch/exhibition-texts';
import { fetchExhibitionHighlightTours } from '@weco/content/services/prismic/fetch/exhibition-highlight-tours';
import * as prismic from '@prismicio/client';
import { PagePrismicDocument } from '../types/pages';
import { VisualStoryDocument } from '../types/visual-stories';
import { eventAccessOptionsFields } from '../fetch-links';
import { Period } from '@weco/common/types/periods';
import { getExhibitionPeriodFilters } from '../types/filters';
import {
  Exhibition,
  ExhibitionRelatedContent,
} from '../../../types/exhibitions';
import {
  articleFormatsFetchLinks,
  contributorFetchLinks,
  eventSeriesFetchLinks,
  exhibitionFormatsFetchLinks,
  exhibitionsFetchLinks,
  seasonsFetchLinks,
} from '../types';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';
import { placesFetchLinks } from '../types/places';
import { teamsFetchLinks } from '../types/teams';
import {
  audienceFetchLinks,
  eventFormatFetchLinks,
  eventPolicyFetchLinks,
  eventsFetchLinks,
  interpretationTypeFetchLinks,
} from '../types/events';
import { seriesFetchLinks } from '../types/series';
import { articlesFetchLinks } from '../types/articles';

const fetchLinks = [
  ...exhibitionFormatsFetchLinks,
  ...exhibitionsFetchLinks,
  ...contributorFetchLinks,
  ...placesFetchLinks,
  ...eventSeriesFetchLinks,
  ...articlesFetchLinks,
  ...eventsFetchLinks,
  ...seasonsFetchLinks,
];

const exhibitionsFetcher = fetcher<ExhibitionPrismicDocument>(
  'exhibitions',
  fetchLinks
);

export type FetchExhibitionResult = {
  exhibition?: ExhibitionPrismicDocument;
  pages: prismic.Query<PagePrismicDocument>;
  visualStories: prismic.Query<VisualStoryDocument>;
  allGuides: {
    id: string;
    type: string;
  }[];
};

export async function fetchExhibition(
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<FetchExhibitionResult> {
  const exhibitionPromise = exhibitionsFetcher.getById(client, id);
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
  });

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
  );

  const [
    exhibition,
    pages,
    visualStories,
    exhibitionGuidesQuery,
    exhibitionTextsQuery,
    exhibitionHighlightToursQuery,
  ] = await Promise.all([
    exhibitionPromise,
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
    exhibition,
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
): Promise<prismic.Query<ExhibitionPrismicDocument>> => {
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
  ];

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
