import { london } from '../../../utils/format-date';
import { OverrideType } from '../../../model/opening-hours';

export const restaurantVenue = {
  id: 'WsuYER8AAOG_NyBA',
  order: 3,
  name: 'Restaurant',
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
        opens: '11:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Wednesday',
        opens: '11:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Thursday',
        opens: '11:00',
        closes: '21:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Friday',
        opens: '11:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Saturday',
        opens: '11:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '18:00',
        isClosed: false,
      },
    ],
    exceptional: [
      {
        overrideDate: london('2022-04-10'),
        overrideType: 'other' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
    ],
  },
  image: {
    '32:15': {},
    '16:9': {},
    square: {},
  },
  linkText: 'Explore the menus',
};
