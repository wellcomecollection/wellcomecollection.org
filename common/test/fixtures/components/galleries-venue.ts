import { london } from '../../../utils/format-date';
import { OverrideType } from '../../../model/opening-hours';

export const galleriesVenue = {
  id: 'Wsttgx8AAJeSNmJ4',
  order: 1,
  name: 'Galleries and Reading Room',
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
  image: {
    dimensions: {
      width: 2979,
      height: 1676,
    },
    alt: "Photograph of a stairway and entrance to a museum gallery space. On the open entrance doors are written 'Being Human'. Walking up the stairs is a woman wearing a face covering. Through the entrance doors the exhibits in the gallery can be seen, including a large transparent human figure, stood on a tabletop. Looking at this exhibit is man wearing a blue shirt and a face covering. In the far distance are the windows through which daylight is streaming.",
    copyright:
      'Being Human gallery| Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
    url: 'https://images.prismic.io/wellcomecollection/c6602161-a15d-4af1-b502-bc11ac23a752_SDP_20201005_0278-177.jpg?auto=compress,format',
    '32:15': {
      dimensions: {
        width: 3200,
        height: 1500,
      },
      alt: "Photograph of a stairway and entrance to a museum gallery space. On the open entrance doors are written 'Being Human'. Walking up the stairs is a woman wearing a face covering. Through the entrance doors the exhibits in the gallery can be seen, including a large transparent human figure, stood on a tabletop. Looking at this exhibit is man wearing a blue shirt and a face covering. In the far distance are the windows through which daylight is streaming.",
      copyright:
        'Being Human gallery| Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
      url: 'https://images.prismic.io/wellcomecollection/c6602161-a15d-4af1-b502-bc11ac23a752_SDP_20201005_0278-177.jpg?auto=compress,format&rect=0,140,2979,1396&w=3200&h=1500',
    },
    '16:9': {
      dimensions: {
        width: 3200,
        height: 1800,
      },
      alt: "Photograph of a stairway and entrance to a museum gallery space. On the open entrance doors are written 'Being Human'. Walking up the stairs is a woman wearing a face covering. Through the entrance doors the exhibits in the gallery can be seen, including a large transparent human figure, stood on a tabletop. Looking at this exhibit is man wearing a blue shirt and a face covering. In the far distance are the windows through which daylight is streaming.",
      copyright:
        'Being Human gallery| Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
      url: 'https://images.prismic.io/wellcomecollection/c6602161-a15d-4af1-b502-bc11ac23a752_SDP_20201005_0278-177.jpg?auto=compress,format&rect=0,0,2979,1676&w=3200&h=1800',
    },
    square: {
      dimensions: {
        width: 3200,
        height: 3200,
      },
      alt: "Photograph of a stairway and entrance to a museum gallery space. On the open entrance doors are written 'Being Human'. Walking up the stairs is a woman wearing a face covering. Through the entrance doors the exhibits in the gallery can be seen, including a large transparent human figure, stood on a tabletop. Looking at this exhibit is man wearing a blue shirt and a face covering. In the far distance are the windows through which daylight is streaming.",
      copyright:
        'Being Human gallery| Steven Pocock | Wellcome Collection | | CC-BY-NC | |',
      url: 'https://images.prismic.io/wellcomecollection/c6602161-a15d-4af1-b502-bc11ac23a752_SDP_20201005_0278-177.jpg?auto=compress,format&rect=652,0,1676,1676&w=3200&h=3200',
    },
  },
  url: 'https://wellcomecollection.org/whats-on',
  linkText: "See what's on",
};
