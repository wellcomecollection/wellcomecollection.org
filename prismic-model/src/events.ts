import title from './parts/title';
import promo from './parts/promo';
import timestamp from './parts/timestamp';
import place from './parts/place';
import link from './parts/link';
import list from './parts/list';
import structuredText from './parts/structured-text';
import embed from './parts/embed';
import booleanDeprecated from './parts/boolean-deprecated';
import text from './parts/text';
import contributorsWithTitle from './parts/contributorsWithTitle';
import body from './parts/body';
import boolean from './parts/boolean';
import number from './parts/number';
import { CustomType } from './types/CustomType';

const events: CustomType = {
  id: 'events',
  label: 'Event',
  repeatable: true,
  status: true,
  json: {
    Event: {
      title,
      format: link('Format', 'document', ['event-formats']),
      place: place,
      isOnline: boolean('Happens Online?', false),
      availableOnline: boolean('Available Online?', false),
      times: list('Times', {
        startDateTime: timestamp('Start'),
        endDateTime: timestamp('End'),
        isFullyBooked: booleanDeprecated('Fully booked'),
      }),
      body,
    },
    Access: {
      isRelaxedPerformance: booleanDeprecated('Relaxed'),
      interpretations: list('Interpretations', {
        interpretationType: link('Interpretation', 'document', [
          'interpretation-types',
        ]),
        isPrimary: booleanDeprecated('Primary interprtation'),
        extraInformation: structuredText('Extra information'),
      }),
      audiences: list('Audiences', {
        audience: link('Audience', 'document', ['audiences']),
      }),
    },
    Reservation: {
      ticketSalesStart: timestamp('Ticket sales start'),
      bookingEnquiryTeam: link('Booking enquiry team', 'document', ['teams']),
      eventbriteEvent: embed('Eventbrite event'),
      // This is what it was labelled on the UI,
      // so that's what we're calling it here
      thirdPartyBookingName: text('Third party booking name'),
      thirdPartyBookingUrl: link('Third party booking url', 'web'),
      bookingInformation: structuredText('Extra information'),
      policies: list('Policies', {
        policy: link('Policy', 'document', ['event-policies']),
      }),
      hasEarlyRegistration: booleanDeprecated('Early registration'),
      cost: text('Cost'),
    },
    Schedule: {
      schedule: list('Events', {
        event: link('Event', 'document', ['events']),
        isNotLinked: booleanDeprecated('Suppress link to event'),
      }),
      backgroundTexture: link('Background texture', 'document', [
        'background-textures',
      ]),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: structuredText('Metadata description', 'single'),
    },
    'Content relationships': {
      series: list('Event series', {
        series: link('Series', 'document', ['event-series']),
      }),
      seasons: list('Seasons', {
        season: link('Season', 'document', ['seasons'], 'Select a Season'),
      }),
      parents: list('Parents', {
        order: number('Order'),
        parent: link('Parent', 'document', ['exhibitions'], 'Select a parent'),
      }),
    },
  },
};

export default events;
