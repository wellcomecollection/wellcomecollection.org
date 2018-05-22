// @flow
import type {Promo} from '../model/promo';
import type {EventPromo} from '../content-model/events';

export const readingRoomPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  title: 'Reading Room',
  url: 'https://wellcomecollection.org/readingroom',
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
  contentType: 'place',
  title: 'Café',
  url: 'https://wellcomecollection.org/visit-us/wellcome-café',
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
  contentType: 'place',
  title: 'Library',
  url: 'https://wellcomecollection.org/visit-us/wellcome-library',
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
  contentType: 'place',
  title: 'Restaurant',
  url: 'https://wellcomecollection.org/visit-us/wellcome-kitchen',
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
  contentType: 'place',
  title: 'Shop',
  url: 'http://bookshop.blackwell.co.uk/bookshop/wellcomeshop/',
  description: 'Come and browse a selection of our quirky gifts and books.',
  image: {
    type: 'picture',
    contentUrl: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2Fb9feb700-cb89-47cc-be19-75b37adc2061_shop.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const spiritBoothPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  title: 'S.P.I.R.I.T Booth',
  url: 'https://wellcomecollection.org/spiritbooth',
  description: 'Get your psychic transparency revealed and captured in our photo booth on level 1.',
  metaIcon: 'clock',
  metaText: 'Open during gallery hours',
  image: {
    type: 'picture',
    contentUrl: 'https://s3.eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/spirit-booth.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const dailyTourPromo: EventPromo = {
  id: 'tours',
  title: 'Daily Guided Tour',
  url: 'https://wellcomecollection.org/tours',
  start: null,
  end: null,
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
    contentUrl: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F7657f9e9-0733-444d-b1b2-6ae0bafa0ff9_c7c94c39161dcfe15d9abd8b40256ea2b40f52b9_c0139861.jpg',
    width: 2996,
    height: 2000,
    alt: ''
  }
};
