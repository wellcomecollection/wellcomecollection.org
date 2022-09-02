import { Venue } from '../../../model/opening-hours';

export const restaurantVenue: Venue = {
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
        overrideDate: new Date('2022-04-10'),
        overrideType: 'other',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
    ],
  },
  linkText: 'Explore the menus',
};
