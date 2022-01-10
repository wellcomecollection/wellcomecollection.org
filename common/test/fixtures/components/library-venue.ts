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
  image: {
    dimensions: {
      width: 3000,
      height: 1688,
    },
    alt: 'Photograph of the entrance desk of a library. Behind the desk a man stands wearing a face covering and a staff lanyard. He is talking to a female visitor standing on the other side of the desk, who is also wearing a face covering, a stripy jacket and who is holding a plastic bag. Between the two of them is a large perspex screen which runs the length of the desk. Queuing behind the visitor at the desk is a man in a pink shirt and a yellow face covering who is holding a see through plastic bag containing a laptop. On the glass partition in the background are two large figurative oil paintings.',
    copyright:
      'Wellcome Library | Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
    url: 'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format',
    '32:15': {
      dimensions: {
        width: 3200,
        height: 1500,
      },
      alt: 'Photograph of the entrance desk of a library. Behind the desk a man stands wearing a face covering and a staff lanyard. He is talking to a female visitor standing on the other side of the desk, who is also wearing a face covering, a stripy jacket and who is holding a plastic bag. Between the two of them is a large perspex screen which runs the length of the desk. Queuing behind the visitor at the desk is a man in a pink shirt and a yellow face covering who is holding a see through plastic bag containing a laptop. On the glass partition in the background are two large figurative oil paintings.',
      copyright:
        'Wellcome Library | Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
      url: 'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format&rect=0,141,3000,1406&w=3200&h=1500',
    },
    '16:9': {
      dimensions: {
        width: 3200,
        height: 1800,
      },
      alt: 'Photograph of the entrance desk of a library. Behind the desk a man stands wearing a face covering and a staff lanyard. He is talking to a female visitor standing on the other side of the desk, who is also wearing a face covering, a stripy jacket and who is holding a plastic bag. Between the two of them is a large perspex screen which runs the length of the desk. Queuing behind the visitor at the desk is a man in a pink shirt and a yellow face covering who is holding a see through plastic bag containing a laptop. On the glass partition in the background are two large figurative oil paintings.',
      copyright:
        'Wellcome Library | Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
      url: 'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format&rect=0,0,3000,1688&w=3200&h=1800',
    },
    square: {
      dimensions: {
        width: 3200,
        height: 3200,
      },
      alt: 'Photograph of the entrance desk of a library. Behind the desk a man stands wearing a face covering and a staff lanyard. He is talking to a female visitor standing on the other side of the desk, who is also wearing a face covering, a stripy jacket and who is holding a plastic bag. Between the two of them is a large perspex screen which runs the length of the desk. Queuing behind the visitor at the desk is a man in a pink shirt and a yellow face covering who is holding a see through plastic bag containing a laptop. On the glass partition in the background are two large figurative oil paintings.',
      copyright:
        'Wellcome Library | Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
      url: 'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format&rect=956,0,1688,1688&w=3200&h=3200',
    },
  },
  url: 'https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Smm',
  linkText: 'Read about the library',
};
