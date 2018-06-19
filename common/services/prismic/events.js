// @flow
import {getDocument} from './api';
import {
  eventAccessOptionsFields,
  teamsFields,
  eventFormatsFields,
  placesFields,
  interpretationTypesFields,
  audiencesFields,
  eventSeriesFields,
  organisationsFields,
  peopleFields,
  contributorsFields
} from './fetch-links';
import {
  parseTitle,
  parseDescription,
  parseContributors,
  parseImagePromo,
  parsePlace,
  asText,
  isDocumentLink
} from './parsers';
import type {Event} from '../../model/events';
import type {PrismicDocument} from './types';

function parseEventDoc(document: PrismicDocument): Event {
  const data = document.data;
  return {
    id: document.id,
    title: parseTitle(data.title),
    description: asText(data.description),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    promo: document.data.promo && parseImagePromo(document.data.promo),
    audiences: [],
    bookingEnquiryTeam: null,
    bookingInformation: null,
    bookingType: null,
    cost: null,
    format: null,
    identifiers: [],
    interpretations: [],
    isDropIn: false,
    series: [],
    times: [],
    // TODO: (event migration)
    body: data.description ? [{
      type: 'text',
      weight: 'default',
      value: parseDescription(data.description)
    }] : []
  };
}

export async function getEvent(req: Request, id: string): Promise<?Event> {
  const document = await getDocument(req, id, {
    fetchLinks: [].concat(
      eventAccessOptionsFields,
      teamsFields,
      eventFormatsFields,
      placesFields,
      interpretationTypesFields,
      audiencesFields,
      eventSeriesFields,
      organisationsFields,
      peopleFields,
      contributorsFields,
      eventSeriesFields
    )
  });

  if (document && document.type === 'events') {
    const event = parseEventDoc(document);
    return event;
  }
}
