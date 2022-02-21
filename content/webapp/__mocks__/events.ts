import { UiEvent } from '@weco/common/model/events';
import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
import { HTMLString } from '@weco/common/services/prismic/types';

const image = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/7657f9e9-0733-444d-b1b2-6ae0bafa0ff9_c7c94c39161dcfe15d9abd8b40256ea2b40f52b9_c0139861.jpg?auto=compress,format',
  width: 2996,
  height: 2000,
  alt: '',
  crops: {},
};

const place = {
  id: 'Wn1fvyoAACgAH_yG',
  title: 'Reading Room',
  body: [],
  labels: [],
  level: 2,
  information: [
    {
      type: 'paragraph',
      text: 'We’ll be in the Reading Room on level 2. You can walk up the spiral staircase to the Reading Room door, or take the lift up and then head left from the Library Desk.',
      spans: [],
    },
  ] as HTMLString,
};

const baseEvent: UiEvent = {
  type: 'events',
  id: 'tours',
  title: 'Daily Guided Tours and Discussions',
  times: [],
  series: [],
  place: undefined,
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
  isRelaxedPerformance: false,
  format: {
    id: 'WmYRpCQAACUAn-Ap',
    title: 'Gallery tour',
    description: undefined,
  },
  body: [],
  dateRange: {
    firstDate: new Date(),
    lastDate: new Date(),
    repeats: 0,
  },
  image: image,
  hasEarlyRegistration: false,
  labels: [
    {
      text: 'Gallery tour',
    },
  ],
  primaryLabels: [],
  secondaryLabels: [],
  promo: {
    image: image,
    link: `/pages/${prismicPageIds.dailyGuidedTours}`,
  },
  promoImage: { ...image },
  displayEnd: new Date(),
  displayStart: new Date(),
  scheduleLength: 0,
  seasons: [],
  isOnline: false,
  availableOnline: false,
  prismicDocument: undefined,
};

export const eventWithPlace: UiEvent = { ...baseEvent, place };
export const eventOnline: UiEvent = { ...baseEvent, isOnline: true };
export const eventWithPlaceOnline: UiEvent = {
  ...baseEvent,
  place,
  isOnline: true,
};
