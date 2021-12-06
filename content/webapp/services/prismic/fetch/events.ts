import { fetcher } from '.';
import { EventPrismicDocument, eventsFetchLinks } from '../events';

const fetchLinks = eventsFetchLinks;

const eventsFetcher = fetcher<EventPrismicDocument>('events', fetchLinks);

export const fetchEvent = eventsFetcher.getById;
export const fetchEvents = eventsFetcher.getByType;
export const fetchEventsClientSide = eventsFetcher.getByTypeClientSide;
