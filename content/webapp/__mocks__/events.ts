import * as prismic from '@prismicio/client';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { PagesDocumentDataBodySlice } from '@weco/common/prismicio-types';
import { Event } from '@weco/content/types/events';

const image = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/7657f9e9-0733-444d-b1b2-6ae0bafa0ff9_c7c94c39161dcfe15d9abd8b40256ea2b40f52b9_c0139861.jpg?auto=compress,format',
  width: 2996,
  height: 2000,
  alt: '',
  crops: {},
};

export const location = {
  id: 'Wn1fvyoAACgAH_yG',
  title: 'Reading Room',
  body: [],
  untransformedBody: [] as prismic.SliceZone<PagesDocumentDataBodySlice>,
  labels: [],
  level: 2,
  information: [
    {
      type: 'paragraph',
      text: 'We’ll be in the Reading Room on level 2. You can walk up the spiral staircase to the Reading Room door, or take the lift up and then head left from the Library Desk.',
      spans: [],
    },
  ] as prismic.RichTextField,
};

const baseEvent: Event = {
  type: 'events',
  id: 'tours',
  uid: 'daily-tours',
  title: 'Daily Guided Tours and Discussions',
  times: [],
  series: [],
  locations: [],
  bookingEnquiryTeam: undefined,
  interpretations: [],
  audiences: [],
  policies: [],
  bookingInformation: undefined,
  cost: undefined,
  bookingType: undefined,
  thirdPartyBooking: undefined,
  isCompletelySoldOut: false,
  isPast: false,
  format: {
    id: 'WmYRpCQAACUAn-Ap',
    title: 'Gallery tour',
    description: undefined,
  },
  untransformedBody: [],
  image,
  hasEarlyRegistration: false,
  labels: [
    {
      text: 'Gallery tour',
    },
  ],
  primaryLabels: [],
  secondaryLabels: [],
  promo: {
    image,
    link: `/visit-us/${prismicPageIds.dailyGuidedTours}`,
  },
  seasons: [],
  isOnline: false,
  availableOnline: false,
  contributors: [],
  onlinePolicies: [],
  onlineHasEarlyRegistration: false,
};

export const eventWithOneLocation: Event = {
  ...baseEvent,
  locations: [location],
};
export const eventWithMultipleLocations: Event = {
  ...baseEvent,
  locations: [location, location],
};
export const eventOnline: Event = { ...baseEvent, isOnline: true };
export const eventWithOneLocationOnline: Event = {
  ...baseEvent,
  locations: [location],
  isOnline: true,
};
export const eventFullyBooked: Event = {
  ...baseEvent,
  times: [
    {
      range: {
        startDateTime: new Date('2035-08-20T14:00:00+0000'),
        endDateTime: new Date('2035-08-24T14:00:00+0000'),
      },
      isFullyBooked: { inVenue: true, online: true },
    },
  ],
};
