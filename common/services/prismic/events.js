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
  parseEventFormat,
  parseImagePromo,
  parsePlace,
  asText,
  asHtml,
  isDocumentLink,
  parseTimestamp,
  parseBoolean
} from './parsers';
import type {UiEvent} from '../../model/events';
import type {PrismicDocument} from './types';

// TODO: NOTE this doesn't have the A/B image test stuff in it
function parseEventDoc(document: PrismicDocument): UiEvent {
  const data = document.data;

  const interpretations = document.data.interpretations.map(interpretation => isDocumentLink(interpretation.interpretationType) ? ({
    interpretationType: {
      title: parseTitle(interpretation.interpretationType.data.title),
      abbreviation: asText(interpretation.interpretationType.data.abbreviation),
      description: asHtml(interpretation.interpretationType.data.description),
      primaryDescription: asHtml(interpretation.interpretationType.data.primaryDescription)
    },
    isPrimary: Boolean(interpretation.isPrimary)
  }) : null).filter(_ => _);

  return {
    id: document.id,
    title: parseTitle(data.title),
    description: asText(data.description),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    promo: document.data.promo && parseImagePromo(document.data.promo),
    audiences: [], // TODO
    bookingEnquiryTeam: null, // TODO
    bookingInformation: null, // TODO
    bookingType: null, // TODO
    cost: document.data.cost,
    format: document.data.format && parseEventFormat(document.data.format),
    identifiers: [], // TODO
    interpretations: interpretations,
    isDropIn: false, // TODO
    series: [], // TODO
    schedule: [], // TODO
    backgroundTexture: document.data.backgroundTexture.data && document.data.backgroundTexture.data.image.url,
    eventbriteId: '', // TODO
    isCompletelySoldOut: false, // TODO
    times: data.times && data.times.map(frag => ({
      range: {
        startDateTime: parseTimestamp(frag.startDateTime),
        endDateTime: parseTimestamp(frag.endDateTime)
      },
      isFullyBooked: parseBoolean(frag.isFullyBooked)
    })),
    // TODO: (event migration)
    body: data.description ? [{
      type: 'text',
      weight: 'default',
      value: parseDescription(data.description)
    }] : []
  };
}

export async function getEvent(req: Request, id: string): Promise<?UiEvent> {
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
