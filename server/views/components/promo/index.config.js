import { createPromo } from '../../../model/promo';
import {ArticlePromoFactory} from '../../../model/article-promo';
import mockJson from '../../../test/mocks/wp-api.json';

const article = ArticlePromoFactory.fromWpApi(mockJson);

export const name = 'Promo';
export const handle = 'promo';
export const collated = true;

export const promo = createPromo({
  modifiers: ['underlined'],
  article: article,
  meta: {
    type: 'article'
  }
});

export const context = { promo };
export const variants = [
  {
    name: 'series-article',
    context: {promo: Object.assign({}, promo, {modifiers: ['series']}, {meta: {type: 'Electricity: part 1'}})}
  },
  {
    name: 'gallery',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined', 'gallery']}, {copy: null}, {meta: {type: 'gallery'}})}
  },
  {
    name: 'podcast',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined', 'podcast']}, {copy: null}, {meta: {type: 'podcast', length: '01:35'}})}
  },
  {
    name: 'video',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined', 'video']}, {copy: null}, {meta: {type: 'video', length: '01:35'}})}
  },
  {
    name: 'standalone',
    context: {promo: Object.assign({}, promo, {meta: {type: 'article', date: null}}, {modifiers: ['series', 'standalone']})}
  }
];
