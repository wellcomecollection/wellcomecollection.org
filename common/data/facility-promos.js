import type {Promo} from '../model/promo';
import type {EventPromo} from '../model/events';

export const readingRoomPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  title: 'Reading Room',
  url: 'https://wellcomecollection.org/pages/Wvlk4yAAAB8A3ufp',
  metaIcon: 'clock',
  metaText: 'Open during gallery hours',
  description: 'Drop in to find inspiration and indulge your curiosity. It’s a gallery, a social space, and a place to unwind.',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/reading-room.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const cafePromo: Promo = {
  type: 'promo',
  id: 'cafePromo',
  contentType: 'place',
  title: 'Café',
  url: 'https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe',
  description: 'Join us for a quick cup of coffee and a pastry, afternoon tea, or a light meal with a glass of wine.',
  image: {
    type: 'picture',
    contentUrl: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F767a5fc5-7095-4772-a22b-275b38e4bd4d_cafe.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const libraryPromo: Promo = {
  type: 'promo',
  id: 'libraryPromo',
  contentType: 'place',
  title: 'Library',
  url: 'https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Smm',
  description: 'Visit our free library for the study of the social and cultural contexts of health and medicine.',
  metaIcon: 'member_card',
  metaText: 'Membership not required',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/wellcome-library.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const restaurantPromo: Promo = {
  type: 'promo',
  id: 'restaurantPromo',
  contentType: 'place',
  title: 'Restaurant',
  url: 'https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Snk',
  description: 'Enjoy delicious lunches, drinks and afternoon tea on level 2.',
  image: {
    type: 'picture',
    contentUrl: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2Fc2475694-73e3-4309-ba6d-100a25fe6864_restaurant.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const shopPromo: Promo = {
  type: 'promo',
  id: 'shopPromo',
  contentType: 'place',
  title: 'Shop',
  url: 'https://wellcomecollection.org/pages/WwgaIh8AAB8AGhC_',
  description: 'Come and browse a selection of our quirky gifts and books.',
  image: {
    type: 'picture',
    contentUrl: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2Fb9feb700-cb89-47cc-be19-75b37adc2061_shop.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const dailyTourPromo: EventPromo = {
  id: 'tours',
  title: 'Daily guided tours and discussions',
  url: 'https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Sma',
  start: null,
  end: null,
  isMultiDate: false,
  isFullyBooked: false,
  hasNotFullyBookedTimes: false,
  description: null,
  series: [],
  schedule: [],
  dateString: 'Tuesday–Sunday',
  timeString: '11:30, 14:30 and 15:30',
  format: {
    id: 'WmYRpCQAACUAn-Ap',
    title: 'Gallery tour',
    shortName: null,
    description: null
  },
  bookingType: null,
  interpretations: [],
  image: {
    type: 'picture',
    contentUrl: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/7657f9e9-0733-444d-b1b2-6ae0bafa0ff9_c7c94c39161dcfe15d9abd8b40256ea2b40f52b9_c0139861.jpg',
    width: 2996,
    height: 2000,
    alt: ''
  }
};
