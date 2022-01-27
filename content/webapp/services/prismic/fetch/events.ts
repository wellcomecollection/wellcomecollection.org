import { fetcher, GetServerSidePropsPrismicClient } from '.';
import { EventPrismicDocument, eventsFetchLinks } from '../types/events';
import { Query } from '@prismicio/types';
import { getPeriodPredicates } from '../types/predicates';
import { startField, endField, graphQuery } from '@weco/common/services/prismic';
import * as prismic from 'prismic-client-beta';

const fetchLinks = eventsFetchLinks;

const eventsFetcher = fetcher<EventPrismicDocument>('events', fetchLinks);

export const fetchEvent = eventsFetcher.getById;

type FetchEventsQueryParams = {
  predicates?: string[];
  period?: 'current-and-coming-up' | 'past',
  isOnline?: boolean,
  availableOnline?: boolean,
  page?: number,
  pageSize?: number,
};

export const fetchEvents = (
  client: GetServerSidePropsPrismicClient,
  {
    predicates = [],
    period,
    isOnline,
    availableOnline,
    page,
    pageSize
  }: FetchEventsQueryParams
): Promise<Query<EventPrismicDocument>> => {
  const order = period === 'past' ? 'desc' : 'asc';
  const orderings =
    order === 'desc'
      ? [{ field: 'my.events.times.startDateTime', order: 'desc' }]
      : [];

  const dateRangePredicates = period
    ? getPeriodPredicates({ period, startField, endField })
    : [];

  const onlinePredicates = isOnline
    ? [prismic.predicate.at('my.events.isOnline', true)]
    : [];

  const availableOnlinePredicates = availableOnline
    ? [prismic.predicate.at('my.events.availableOnline', true)]
    : [];

  return eventsFetcher.getByType(
    client,
    {
      predicates: [
        ...dateRangePredicates,
        ...onlinePredicates,
        ...availableOnlinePredicates,
        ...predicates
      ],
      orderings,
      page,
      pageSize,
      graphQuery
    }
  )
};

export const fetchEventsClientSide = eventsFetcher.getByTypeClientSide;
