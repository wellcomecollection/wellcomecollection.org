import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { EventBasic } from '@weco/content/types/events';
import EventCard from '@weco/content/views/components/EventCard';

const image = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/aKjF9GGNHVfTOK5a_EP_002740_020-medium.jpg?w=675&auto=compress%2Cformat&rect=0%2C63%2C1200%2C675&q=50',
  width: 1200,
  height: 675,
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
    timeString="11:45, 14:15 and 15:15"
  />
);
export default DailyTourCard;
