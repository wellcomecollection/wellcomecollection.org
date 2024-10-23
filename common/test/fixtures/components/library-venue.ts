import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { Venue } from '@weco/common/model/opening-hours';

export const libraryVenue: Venue = {
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
        overrideDate: new Date('2023-01-01'),
        overrideType: 'Christmas and New Year',
        opens: '20:00',
        closes: '21:00',
        isClosed: false,
      },
      {
        overrideDate: new Date('2022-12-31'),
        overrideType: 'Christmas and New Year',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: new Date('2022-12-30'),
        overrideType: 'Christmas and New Year',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: new Date('2022-12-28'),
        overrideType: 'Christmas and New Year',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
    ],
  },
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format',
    width: 3000,
    height: 1688,
    alt: 'Photograph of the entrance desk of a library. Behind the desk a man stands wearing a face covering and a staff lanyard. He is talking to a female visitor standing on the other side of the desk, who is also wearing a face covering, a stripy jacket and who is holding a plastic bag. Between the two of them is a large perspex screen which runs the length of the desk. Queuing behind the visitor at the desk is a man in a pink shirt and a yellow face covering who is holding a see through plastic bag containing a laptop. On the glass partition in the background are two large figurative oil paintings.',
    tasl: {
      title: 'Wellcome Library',
      author: 'Steven Pocock',
      sourceName: 'Wellcome Collection',
      license: 'CC-BY-NC',
    },
    simpleCrops: {
      '32:15': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format&rect=0,141,3000,1406&w=3200&h=1500',
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format&rect=0,0,3000,1688&w=3200&h=1800',
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/39d05e21-67d6-4fd8-b2ef-fb662e0fff85_SDP_20201005_0365-265.jpg?auto=compress,format&rect=956,0,1688,1688&w=3200&h=3200',
        width: 3200,
        height: 3200,
      },
    },
  },
  url: `https://wellcomecollection.org/pages/${prismicPageIds.library}`,
  linkText: 'Read about the library',
};
