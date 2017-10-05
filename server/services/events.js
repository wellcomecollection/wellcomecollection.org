// @flow
import type {Event} from '../content-model/event';
import type {IApi} from 'prismic-javascript';
import Prismic from 'prismic-javascript';
import {prismicApi, prismicPreviewApi} from './prismic-api';

import {parseEventDoc} from './prismic-parsers';

export async function getEvent(id: string, previewReq: ?Request): Promise<?Event> {
  const prismic: IApi = previewReq ? await prismicPreviewApi(previewReq) : await prismicApi();
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'event-access-options.title', 'event-access-options.acronym',
    'event-booking-enquiry-teams.title', 'event-booking-enquiry-teams.email', 'event-booking-enquiry-teams.phone',
    'event-formats.title', 'event-programmes.title',
    'editorial-contributor-roles.title', 'event-contributor-roles.title'
  ];

  const events: Object = await prismic.query(Prismic.Predicates.at('document.id', id), {fetchLinks});
  const event: ?Object = events.total_results_size === 1 ? events.results[0] : null;

  if (!event) {
    return null;
  }

  return parseEventDoc(event);
}
