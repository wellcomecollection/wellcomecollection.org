// @flow
import EventPromo from '../EventPromo/EventPromo';

const data = {
  id: 'tours',
  title: 'Daily guided tours and discussions',
  url: 'https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Sma',
  start: null,
  end: null,
  isMultiDate: false,
  isFullyBooked: false,
  hasNotFullyBookedTimes: false,
  description: null,
  series: [],
  schedule: [],
  dateString: 'Tuesday–Sunday',
  timeString: '11:30, 14:30 and 15:30',
  format: {
    id: 'WmYRpCQAACUAn-Ap',
    title: 'Gallery tour',
    shortName: null,
    description: null
  },
  bookingType: null,
  interpretations: [],
  image: {
    contentUrl: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/7657f9e9-0733-444d-b1b2-6ae0bafa0ff9_c7c94c39161dcfe15d9abd8b40256ea2b40f52b9_c0139861.jpg',
    width: 2996,
    height: 2000,
    alt: '',
    tasl: {
      author: null,
      copyrightHolder: null,
      copyrightLink: null,
      license: null,
      sourceLink: null,
      sourceName: null,
      title: null
    }
  }
};

const DailyTourPromo = () => (<EventPromo {...data} />);
export default DailyTourPromo;
