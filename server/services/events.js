// @flow
import type {DateRange} from '../content-model/content-blocks';
import type {Event, EventFormat} from '../content-model/event';
import type {IApi} from 'prismic-javascript';
import {List} from 'immutable';
import Prismic from 'prismic-javascript';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import {getContributors, getPromo, asText, asHtml} from './prismic-content';

export async function getEvent(id: string, previewReq: ?Request): Promise<?Event> {
  const prismic: IApi = previewReq ? await prismicPreviewApi(previewReq) : await prismicApi();
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'event-access-options.title', 'event-access-options.acronym',
    'event-booking-enquiry-teams.title', 'event-booking-enquiry-teams.email', 'event-booking-enquiry-teams.phone',
    'event-formats.title'
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

  const e = ({
    id: event.id,
    title: asText(event.data.title),
    format: event.data.format.data && ({ title: asText(event.data.format.data.title) }: EventFormat),
    when: when,
    description: asHtml(event.data.description),
    accessOptions: List(event.data.accessOptions.map(ao => ({
      accessOption: { title: asText(ao.accessOption.data.title), acronym: ao.accessOption.data.acronym },
      designer: ao.designer.data && { name: ao.designer.data.name }
    }))),
    bookingEnquiryTeam: event.data.bookingEnquiryTeam.data && {
      title: asText(event.data.bookingEnquiryTeam.data.title),
      email: event.data.bookingEnquiryTeam.data.email,
      phone: event.data.bookingEnquiryTeam.data.phone
    },
    bookingInformation: asHtml(event.data.bookingInformation),
    contributors: contributors,
    promo: promo
  }: Event);

  return e;
}
