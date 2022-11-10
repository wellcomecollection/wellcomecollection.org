import { EventBasic } from '../../types/events';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import EventPromo from '../EventPromo/EventPromo';
import { FunctionComponent } from 'react';

const image = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/7657f9e9-0733-444d-b1b2-6ae0bafa0ff9_c7c94c39161dcfe15d9abd8b40256ea2b40f52b9_c0139861.jpg?auto=compress,format',
  width: 2996,
  height: 2000,
  alt: '',
  crops: {},
};

const data: EventBasic = {
  id: 'tours',
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
    link: `/pages/${prismicPageIds.dailyGuidedTours}`,
  },
  scheduleLength: 0,
  isOnline: false,
  availableOnline: false,
  type: 'events',
};

const DailyTourPromo: FunctionComponent = () => (
  <EventPromo
    event={data}
    dateString={'Tuesday–Sunday'}
    timeString={'11:45, 14:45 and 15:45'}
  />
);
export default DailyTourPromo;
