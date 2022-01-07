import { london } from '../../../utils/format-date';
import { OverrideType } from '../../../model/opening-hours';

export const galleriesVenue = {
  id: 'Wsttgx8AAJeSNmJ4',
  order: 1,
  name: 'Galleries',
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
        closes: '21:00',
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
    exceptional: [
      {
        overrideDate: london('2022-01-01'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '12:00',
        closes: '14:00',
        isClosed: false,
      },
      {
        overrideDate: london('2022-01-01'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '12:00',
        closes: '14:00',
        isClosed: false,
      },
      {
        overrideDate: london('2021-12-31'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2021-12-20'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2022-02-04'),
        overrideType: 'Bank holiday' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2022-02-05'),
        overrideType: 'Bank holiday' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2021-01-05'),
        overrideType: 'Bank holiday' as OverrideType,
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2022-12-31'),
        overrideType: 'Christmas and New Year' as OverrideType,
        opens: '10:00',
        closes: '14:00',
        isClosed: false,
      },
    ],
  },
};
