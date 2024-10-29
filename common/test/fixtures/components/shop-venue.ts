import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { Venue } from '@weco/common/model/opening-hours';

export const shopVenue = {
  id: 'WsuaIB8AAH-yNylo',
  order: 5,
  name: 'Shop',
  openingHours: {
    regular: [
      {
        dayOfWeek: 'Monday',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        dayOfWeek: 'Tuesday',
        opens: '09:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Wednesday',
        opens: '09:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Thursday',
        opens: '09:00',
        closes: '21:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Friday',
        opens: '09:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      },
    ],
    exceptional: [],
  },
  url: `https://wellcomecollection.org/visit-us/${prismicPageIds.shop}`,
  linkText: 'Books and gifts',
} as Venue;
