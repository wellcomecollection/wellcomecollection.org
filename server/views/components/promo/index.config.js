import { Promo } from '../../../model/promo';

export const name = 'Promo';
export const handle = 'promo';
export const collated = true;

const promo = new Promo({
  url: '#',
  image: {
    sources: [
      {
        src: 'https://placehold.it/1600x900',
        size: 1600
      },
      {
        src: 'https://placehold.it/800x450',
        size: 800
      },
      {
        src: 'https://placehold.it/400x225',
        size: 400
      }
    ],
    alt: 'image alt text'
  },
  meta: {
    type: 'article',
    date: null,
    length: '01:54'
  },
  title: 'The natural power of electricity',
  copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at hendrerit justo. Donec quis nibh malesuada, accumsan libero eu, commodo.'
}).toJS();

export const context = { promo };
export const variants = [
  {name: 'series-article', context: {promo, modifiers: ['underlined', 'series']}},
  {name: 'gallery', context: {promo, type: 'gallery', modifiers: ['underlined', 'gallery']}},
  {name: 'podcast', context: {promo, type: 'podcast', modifiers: ['underlined', 'podcast']}},
  {name: 'video', context: {promo, type: 'video', modifiers: ['underlined', 'video']}},
  {name: 'standalone', context: {promo, modifiers: ['series', 'standalone']}}
];
