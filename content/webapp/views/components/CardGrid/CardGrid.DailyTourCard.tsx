import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { EventBasic } from '@weco/content/types/events';
import EventCard from '@weco/content/views/components/EventCard';

const image = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/7657f9e9-0733-444d-b1b2-6ae0bafa0ff9_c7c94c39161dcfe15d9abd8b40256ea2b40f52b9_c0139861.jpg?auto=compress,format',
  width: 2996,
  height: 2000,
  alt: '',
  crops: {},
};

export const data: EventBasic = {
  id: 'tours',
  uid: 'daily-tours',
  title: 'Daily Guided Tours and Discussions',
  times: [],
  series: [],
  locations: [],
  cost: undefined,
  isPast: false,
  labels: [],
  primaryLabels: [],
  secondaryLabels: [],
  promo: {
    image,
    link: `/visit-us/${prismicPageIds.dailyGuidedTours}`,
  },
  image,
  isOnline: false,
  availableOnline: false,
  type: 'events',
};

const DailyTourCard: FunctionComponent = () => (
  <EventCard
    event={data}
    dateString="Tuesday–Sunday"
    timeString="11:45, 14:15 (& 15:15 for pre-organised groups)"
  />
);
export default DailyTourCard;
