import { Day } from '../../../model/opening-hours';

export const shopVenue = {
  id: 'WsuaIB8AAH-yNylo',
  order: 5,
  name: 'Shop',
  openingHours: {
    regular: [
      {
        dayOfWeek: 'Monday' as Day,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        dayOfWeek: 'Tuesday' as Day,
        opens: '09:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Wednesday' as Day,
        opens: '09:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Thursday' as Day,
        opens: '09:00',
        closes: '21:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Friday' as Day,
        opens: '09:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Saturday' as Day,
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Sunday' as Day,
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      },
    ],
    exceptional: [],
  },
  image: {
    '32:15': {},
    '16:9': {},
    square: {},
  },
  url: 'https://wellcomecollection.org/pages/WwgaIh8AAB8AGhC_',
  linkText: 'Books and gifts',
};
