import { london } from '../../../utils/format-date';
import { OverrideType } from '../../../model/opening-hours';

export const libraryVenue = {
  id: 'WsuS_R8AACS1Nwlx',
  order: 2,
  name: 'Library',
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
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Wednesday',
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Thursday',
        opens: '10:00',
        closes: '20:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Friday',
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Sunday',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
    ],
    exceptional: [
      {
        overrideDate: london('2023-01-01'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '20:00',
        closes: '21:00',
        isClosed: false,
      },
      {
        overrideDate: london('2022-12-31'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2022-12-30'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2022-12-28'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
    ],
  },
};
