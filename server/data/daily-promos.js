// @flow
import type { Promo } from '../model/promo';

export const readingRoomPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  id: 'reading-room',
  title: 'Reading room',
  url: '/readingroom',
  description: 'Drop in to find inspiration and indulge your curiosity. It’s a gallery, a social space, and a place to unwind.',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/reading-room.png',
    width: 408,
    height: 229,
    alt: ''
  }
};

export const cafeAndKitchenPromo: Promo = {
  type: 'promo',
  contentType: 'place',
  id: 'cafe-and-kitchen',
  title: 'Cafe and kitchen',
  url: '/visit-us/eat-and-shop',
  description: 'Join us for a quick cup of coffee and a pastry, afternoon tea, or a light meal with a glass of wine. Hungry for more? Join us for delicious lunches, drinks and afternoon tea on level 2.',
  image: {
    type: 'picture',
    contentUrl: 'https://s3-eu-west-1.amazonaws.com/static.wellcomecollection.org/daily-promo-images/cafe-and-kitchen.png',
    width: 408,
    height: 229,
    alt: ''
  }
};
