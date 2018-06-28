// @flow
import {getDocument, getTypeByIds} from './api';
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
  asHtml,
  isDocumentLink,
  parseTimestamp,
  parseBoolean
} from './parsers';
import type {UiEvent, EventFormat} from '../../model/events';
import type {PrismicDocument, PrismicApiSearchResponse} from './types';

function parseEventFormat(frag: Object): ?EventFormat {
  return isDocumentLink(frag) ? {
    id: frag.id,
    title: parseTitle(frag.data.title),
    shortName: asText(frag.data.shortName),
    description: asHtml(frag.data.description)
  } : null;
}

// TODO: NOTE this doesn't have the A/B image test stuff in it
function parseEventDoc(document: PrismicDocument, scheduleDocs: ?PrismicApiSearchResponse): UiEvent {
  const data = document.data;
  const eventSchedule = scheduleDocs && scheduleDocs.results ? scheduleDocs.results.map(doc => parseEventDoc(doc)) : [];
  const interpretations = document.data.interpretations.map(interpretation => isDocumentLink(interpretation.interpretationType) ? ({
    interpretationType: {
      title: parseTitle(interpretation.interpretationType.data.title),
      abbreviation: asText(interpretation.interpretationType.data.abbreviation),
      description: asHtml(interpretation.interpretationType.data.description),
      primaryDescription: asHtml(interpretation.interpretationType.data.primaryDescription)
    },
    isPrimary: Boolean(interpretation.isPrimary)
  }) : null).filter(_ => _);

  const eventbriteId = document.data.eventbriteEvent && /\/e\/([0-9]+)/.exec(document.data.eventbriteEvent.url)[1];

  return {
    id: document.id,
    title: parseTitle(data.title),
    description: asText(data.description),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    promo: document.data.promo && parseImagePromo(document.data.promo),
    audiences: [], // TODO
    bookingEnquiryTeam: null, // TODO
    bookingInformation: asHtml(document.data.bookingInformation),
    bookingType: null, // TODO
    cost: document.data.cost,
    format: document.data.format && parseEventFormat(document.data.format),
    interpretations: interpretations,
    isDropIn: false, // TODO
    series: [], // TODO
    schedule: eventSchedule,
    backgroundTexture: document.data.backgroundTexture.data && document.data.backgroundTexture.data.image.url,
    eventbriteId,
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

const fetchLinks = [].concat(
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
);

export async function getEvent(req: Request, id: string): Promise<?UiEvent> {
  const document = await getDocument(req, id, {
    fetchLinks: fetchLinks
  });

  if (document && document.type === 'events') {
    const scheduleIds = document.data.schedule.map(event => event.event.id);
    const eventScheduleDocs = scheduleIds.length > 0 && await getTypeByIds(req, ['events'], scheduleIds, {fetchLinks});
    const event = parseEventDoc(document, eventScheduleDocs || null);
    return event;
  }
}
