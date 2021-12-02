import { fetcher } from '.';
import { EventPrismicDocument } from '../events';

const fetchLinks = [];

const eventsFetcher = fetcher<EventPrismicDocument>('events', fetchLinks);

export const fetchEvent = eventsFetcher.getById;
export const fetchEvents = eventsFetcher.getByType;
export const fetchEventsClientSide = eventsFetcher.getByTypeClientSide;
