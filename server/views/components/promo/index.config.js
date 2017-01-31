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
  {
    name: 'series-article',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined', 'series']}, {meta: {date: 'September 09 2016'}})}
  },
  {
    name: 'gallery',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined', 'gallery']}, {meta: {type: 'gallery'}})}
  },
  {
    name: 'podcast',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined', 'podcast']}, {meta: {type: 'podcast', length: '01:35'}})}
  },
  {
    name: 'video',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined', 'video']}, {meta: {type: 'video', length: '01:35'}})}
  },
  {
    name: 'standalone',
    context: {promo: Object.assign({}, promo, {modifiers: ['series', 'standalone']}, {meta: {date: 'September 09 2016'}})}
  }
];
