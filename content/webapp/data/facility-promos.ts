import { clock, memberCard } from '@weco/common/icons';
import { FacilityPromo } from 'types/facility-promo';

export const readingRoomPromo: FacilityPromo = {
  id: 'readingRoomPromo',
  title: 'Reading Room',
  url: 'https://wellcomecollection.org/pages/Wvlk4yAAAB8A3ufp',
  metaIcon: clock,
  metaText: 'Open during gallery hours',
  description:
    'Drop in to find inspiration and indulge your curiosity. It’s a gallery, a social space, and a place to unwind.',
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/1f71dfb0-c65e-4e35-affd-19a78545f0f1_SDP_20201005_0649-41-Edit.jpg?auto=compress,format',
    width: 408,
    height: 229,
    alt: '',
  },
};

export const cafePromo: FacilityPromo = {
  id: 'cafePromo',
  title: 'Café',
  url: 'https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe',
  description:
    'Join us for a quick cup of coffee and a pastry, afternoon tea, or a light meal with a glass of wine.',
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection/3062e92b-693f-4dd0-9435-f63d6bc370e7_SDP_20201005_0365-176-Edit.jpg?auto=compress,format',
    width: 408,
    height: 229,
    alt: '',
  },
};

export const libraryPromo: FacilityPromo = {
  id: 'libraryPromo',
  title: 'Library',
  url: 'https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Smm',
  description:
    'Visit our free library for the study of the social and cultural contexts of health and medicine.',
  metaIcon: memberCard,
  metaText: 'Membership not required',
  image: {
    contentUrl:
      'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/wellcome-library.png',
    width: 408,
    height: 229,
    alt: '',
  },
};

export const shopPromo: FacilityPromo = {
  id: 'shopPromo',
  title: 'Shop',
  url: 'https://wellcomecollection.org/pages/WwgaIh8AAB8AGhC_',
  description: 'Come and browse a selection of our quirky gifts and books.',
  image: {
    contentUrl:
      'https://images.prismic.io/wellcomecollection%2Fb9feb700-cb89-47cc-be19-75b37adc2061_shop.png',
    width: 408,
    height: 229,
    alt: '',
  },
};
