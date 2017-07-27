// @flow
import type {Event, EventFormat, EventBookingType, DateRange} from '../content-model/content-blocks';
import type {IApi} from 'prismic-javascript';
import {List} from 'immutable';
import Prismic from 'prismic-javascript';
import {RichText} from 'prismic-dom';
import {prismicApi} from './prismic-api';
import {getContributors, getPromo, getFeaturedMediaFromBody} from './prismic-content';

export async function getEvent(id: string): Promise<?Event> {
  const prismic: IApi = await prismicApi();
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'access-statements.title', 'access-statements.description'
  ];
  const events: Object = await prismic.query(Prismic.Predicates.at('document.id', id), {fetchLinks});
  const event: ?Object = events.total_results_size === 1 ? events.results[0] : null;

  if (!event) {
    return null;
  }

  const contributors = getContributors(event);
  const promo = getPromo(event);
  const when: List<DateRange> = List(event.data.when.map(slice => {
    return ({
      start: new Date(slice.primary.start),
      end: new Date(slice.primary.end)
    }: DateRange);
  }));
  const featuredMedia = getFeaturedMediaFromBody(event);

  const e = ({
    blockType: 'events',
    id: event.id,
    title: RichText.asText(event.data.title),
    format: (event.data.format: EventFormat),
    bookingType: (event.data.bookingType: EventBookingType),
    when: when,
    contributors: contributors,
    promo: promo,
    featuredMedia: featuredMedia
  }: Event);

  return e;
}
