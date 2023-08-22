import title from './parts/title';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import { documentLink, webLink } from './parts/link';
import list from './parts/list';
import { multiLineText, singleLineText } from './parts/text';
import embed from './parts/embed';
import booleanDeprecated from './parts/boolean-deprecated';
import keyword from './parts/keyword';
import contributorsWithTitle from './parts/contributorsWithTitle';
import { body } from './parts/bodies';
import boolean from './parts/boolean';
import number from './parts/number';
import { CustomType } from './types/CustomType';

function reservationBlock(prefix?: string) {
  return {
    [prefix ? `${prefix}TicketSalesStart` : 'ticketSalesStart']:
      timestamp('Ticket sales start'),
    [prefix ? `${prefix}BookingEnquiryTeam` : 'bookingEnquiryTeam']:
      documentLink('Booking enquiry team', { linkedType: 'teams' }),
    [prefix ? `${prefix}EventbriteEvent` : 'eventbriteEvent']:
      embed('Eventbrite event'),
    // This is what it was labelled on the UI,
    // so that's what we're calling it here
    [prefix ? `${prefix}ThirdPartyBookingName` : 'thirdPartyBookingName']:
      keyword('Third party booking name'),
    [prefix ? `${prefix}ThirdPartyBookingUrl` : 'thirdPartyBookingUrl']:
      webLink('Third party booking url'),
    [prefix ? `${prefix}BookingInformation` : 'bookingInformation']:
      multiLineText('Extra information'),
    [prefix ? `${prefix}Policies` : 'policies']: list('Policies', {
      policy: documentLink('Policy', { linkedType: 'event-policies' }),
    }),
    [prefix ? `${prefix}HasEarlyRegistration` : 'hasEarlyRegistration']:
      booleanDeprecated('Early registration'),
    [prefix ? `${prefix}Cost` : 'cost']: keyword('Cost'),
  };
}

const events: CustomType = {
  id: 'events',
  label: 'Event',
  repeatable: true,
  status: true,
  json: {
    Event: {
      title,
      format: documentLink('Format', { linkedType: 'event-formats' }),
      locations: list('Locations', {
        location: documentLink('Location', { linkedType: 'places' }),
      }),
      isOnline: boolean('Happens Online?', { defaultValue: false }),
      availableOnline: boolean('Available Online?', { defaultValue: false }),
      times: list('Times', {
        startDateTime: timestamp('Start'),
        endDateTime: timestamp('End'),
        isFullyBooked: booleanDeprecated('In-venue fully booked'),
        onlineIsFullyBooked: booleanDeprecated('Online fully booked'),
      }),
      body,
    },
    Access: {
      isRelaxedPerformance: booleanDeprecated('Relaxed'),
      interpretations: list('Interpretations', {
        interpretationType: documentLink('Interpretation', {
          linkedType: 'interpretation-types',
        }),
        isPrimary: booleanDeprecated('Primary interprtation'),
        extraInformation: multiLineText('Extra information'),
      }),
      audiences: list('Audiences', {
        audience: documentLink('Audience', { linkedType: 'audiences' }),
      }),
    },
    Reservation: reservationBlock(),
    'Online reservation': reservationBlock('online'),
    Schedule: {
      schedule: list('Events', {
        event: documentLink('Event', { linkedType: 'events' }),
        isNotLinked: booleanDeprecated('Suppress link to event'),
      }),
      backgroundTexture: documentLink('Background texture', {
        linkedType: 'background-textures',
      }),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: singleLineText('Metadata description'),
    },
    'Content relationships': {
      series: list('Event series', {
        series: documentLink('Series', { linkedType: 'event-series' }),
      }),
      seasons: list('Seasons', {
        season: documentLink('Season', {
          linkedType: 'seasons',
          placeholder: 'Select a Season',
        }),
      }),
      parents: list('Parents', {
        order: number('Order'),
        parent: documentLink('Parent', {
          linkedType: 'exhibitions',
          placeholder: 'Select a parent',
        }),
      }),
    },
  },
  format: 'custom',
};

export default events;
