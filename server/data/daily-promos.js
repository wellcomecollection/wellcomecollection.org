// @flow
import type { Promo } from '../model/promo';

export const readingRoomPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  title: 'Reading room',
  url: '/readingroom',
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
  title: 'Cafe',
  url: '/visit-us/wellcome-café',
  description: 'Join us for a quick cup of coffee and a pastry, afternoon tea, or a light meal with a glass of wine.',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/wellcome-cafe.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const libraryPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  title: 'Library',
  url: '/visit-us/wellcome-library',
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
  url: '/visit-us/wellcome-kitchen',
  description: 'Hungry for more? Join us for delicious lunches, drinks and afternoon tea on level 2.',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/wellcome-kitchen.jpg',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const bookshopPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  title: 'Bookshop',
  url: 'http://bookshop.blackwell.co.uk/bookshop/wellcomeshop/',
  description: 'Come and browse a selection of our quirky gifts and books.',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/wellcome-shop.jpg',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const spiritBoothPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  title: 'S.P.I.R.I.T. Booth',
  url: 'https://wellcomecollection.org/spiritbooth',
  description: 'Get your psychic transparency revealed and captured.',
  metaIcon: 'clock',
  metaText: 'Open during gallery hours',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/wellcome-shop.jpg',
    width: 408,
    height: 229,
    alt: ''
  }
};
