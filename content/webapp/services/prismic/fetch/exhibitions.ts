import { clientSideFetcher, fetcher, GetServerSidePropsPrismicClient } from '.';
import {
  ExhibitionPrismicDocument,
  ExhibitionRelatedContentPrismicDocument,
} from '../types/exhibitions';
import { Query } from '@prismicio/types';
import { fetchPages } from './pages';
import * as prismic from '@prismicio/client';
import { PagePrismicDocument } from '../types/pages';
import {
  eventAccessOptionsFields,
  audiencesFields,
  articleSeriesFields,
  articlesFields,
  exhibitionResourcesFields,
  eventsFields,
} from '../fetch-links';
import { Period } from '../../../types/periods';
import { getPeriodPredicates } from '../types/predicates';
import {
  Exhibition,
  ExhibitionRelatedContent,
} from '../../../types/exhibitions';
import superjson from 'superjson';
import {
  articleFormatsFetchLinks,
  contributorFetchLinks,
  eventSeriesFetchLinks,
  exhibitionFormatsFetchLinks,
  exhibitionsFetchLinks,
  seasonsFetchLinks,
} from '../types';
import { placesFetchLinks } from '../types/places';
import { teamsFetchLinks } from '../types/teams';
import {
  eventFormatFetchLinks,
  eventPolicyFetchLinks,
  interpretationTypeFetchLinks,
} from '../types/events';

const fetchLinks = [
  ...exhibitionFormatsFetchLinks,
  ...exhibitionsFetchLinks,
  ...contributorFetchLinks,
  ...placesFetchLinks,
  ...exhibitionResourcesFields,
  ...eventSeriesFetchLinks,
  ...articlesFields,
  ...eventsFields,
  ...seasonsFetchLinks,
];

const exhibitionsFetcher = fetcher<ExhibitionPrismicDocument>(
  'exhibitions',
  fetchLinks
);

export type FetchExhibitionResult = {
  exhibition?: ExhibitionPrismicDocument;
  pages: Query<PagePrismicDocument>;
};

export async function fetchExhibition(
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<FetchExhibitionResult> {
  const exhibitionPromise = exhibitionsFetcher.getById(client, id);
  const pageQueryPromise = fetchPages(client, {
    predicates: [prismic.predicate.at('my.pages.parents.parent', id)],
  });

  const [exhibition, pages] = await Promise.all([
    exhibitionPromise,
    pageQueryPromise,
  ]);

  return {
    exhibition,
    pages,
  };
}

const startField = 'my.exhibitions.start';
const endField = 'my.exhibitions.end';

type Order = 'desc' | 'asc';
type GetExhibitionsProps = {
  predicates?: string[];
  order?: Order;
  period?: Period;
  page?: number;
};

export const fetchExhibitions = (
  client: GetServerSidePropsPrismicClient,
  {
    predicates = [],
    order = 'desc',
    period,
    page = 1,
  }: GetExhibitionsProps = {}
): Promise<Query<ExhibitionPrismicDocument>> => {
  const orderings: prismic.Ordering[] = [
    { field: 'my.exhibitions.isPermament', direction: 'desc' },
    { field: endField, direction: order },
  ];

  const periodPredicates = period
    ? getPeriodPredicates({ period, startField, endField })
    : [];

  return exhibitionsFetcher.getByType(client, {
    predicates: [...predicates, ...periodPredicates],
    orderings,
    page,
  });
};

const fetchExhibitionsClientSide =
  clientSideFetcher<Exhibition>('exhibitions').getByTypeClientSide;

export const fetchExhibitExhibition = async (
  exhibitId: string
): Promise<Exhibition | undefined> => {
  const predicates = [
    prismic.predicate.at('my.exhibitions.exhibits.item', exhibitId),
  ];

  const response = await fetchExhibitionsClientSide({ predicates });

  return response && response.results.length > 0
    ? response.results[0]
    : undefined;
};

export const fetchExhibitionRelatedContent = async (
  { client }: GetServerSidePropsPrismicClient,
  ids: string[]
): Promise<Query<ExhibitionRelatedContentPrismicDocument>> => {
  const fetchLinks = [
    ...eventAccessOptionsFields,
    ...teamsFetchLinks,
    ...eventFormatFetchLinks,
    ...placesFetchLinks,
    ...interpretationTypeFetchLinks,
    ...audiencesFields,
    ...contributorFetchLinks,
    ...eventSeriesFetchLinks,
    ...eventPolicyFetchLinks,
    ...articleSeriesFields,
    ...articleFormatsFetchLinks,
    ...exhibitionFormatsFetchLinks,
    ...exhibitionsFetchLinks,
    ...articlesFields,
  ];

  return client.getByIDs<ExhibitionRelatedContentPrismicDocument>(ids, {
    fetchLinks,
  });
};

export const fetchExhibitionRelatedContentClientSide = async (
  ids: string[]
): Promise<ExhibitionRelatedContent | undefined> => {
  // If you add more parameters here, you have to update the corresponding cache behaviour
  // in the CloudFront distribution, or you may get incorrect behaviour.
  //
  // e.g. at one point we forgot to include the "params" query in the cache key,
  // so every article was showing the same set of related stories.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('params', JSON.stringify(ids));

  // If we have multiple content types, use the first one as the ID.
  const url = `/api/exhibitions-related-content?${urlSearchParams.toString()}`;

  const response = await fetch(url);

  if (response.ok) {
    const json = await response.text();
    return superjson.parse<ExhibitionRelatedContent>(json);
  }
};
