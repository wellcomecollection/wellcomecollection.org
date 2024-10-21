import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { Venue } from '@weco/common/model/opening-hours';

export const cafeVenue: Venue = {
  id: 'WsuZKh8AAOG_NyUo',
  order: 4,
  name: 'Café',
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
        opens: '08:30',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Wednesday',
        opens: '08:30',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Thursday',
        opens: '08:30',
        closes: '21:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Friday',
        opens: '08:30',
        closes: '18:00',
        isClosed: false,
      },
      {
        dayOfWeek: 'Saturday',
        opens: '09:30',
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
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/3062e92b-693f-4dd0-9435-f63d6bc370e7_SDP_20201005_0365-176-Edit.jpg?auto=compress,format',
    width: 2931,
    height: 1649,
    alt: 'Photograph of a café interior. A woman is sat at a high table working on an open laptop. To her right is a disposable coffee cup and to her left is a small pot plant. In the background another woman is sat on a long bench seat at a table. She is also working on an open laptop',
    tasl: {
      title: 'Wellcome Café',
      author: 'Steven Pocock',
      sourceName: 'Wellcome Collection',
      license: 'CC-BY-NC',
    },
    simpleCrops: {
      '32:15': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/3062e92b-693f-4dd0-9435-f63d6bc370e7_SDP_20201005_0365-176-Edit.jpg?auto=compress,format&rect=0,137,2931,1374&w=3200&h=1500',
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/3062e92b-693f-4dd0-9435-f63d6bc370e7_SDP_20201005_0365-176-Edit.jpg?auto=compress,format&rect=0,0,2931,1649&w=3200&h=1800',
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/3062e92b-693f-4dd0-9435-f63d6bc370e7_SDP_20201005_0365-176-Edit.jpg?auto=compress,format&rect=358,0,1649,1649&w=3200&h=3200',
        width: 3200,
        height: 3200,
      },
    },
  },
  url: `https://wellcomecollection.org/pages/${prismicPageIds.cafe}`,
  linkText: 'Take a break in our café',
};
