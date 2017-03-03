// @flow
import {createPromo} from '../../../model/promo';
import {ArticleStubFactory} from '../../../model/article-stub';
import mockJson from '../../../test/mocks/wp-api.json';

const article = ArticleStubFactory.fromWpApi(mockJson);
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

const articleInSeries = Object.assign({}, article, {series: {
  url: '#',
  name: 'A series',
  description: 'This is a series',
  items: ['promo1', 'promo2', 'promo3'],
  total: 5,
  color: 'purple'
}}, {positionInSeries: 3});

const promoInSeries = Object.assign({}, promo, {article: articleInSeries});

export const variants = [
  {
    name: 'series-article',
    context: {promo: Object.assign({}, promo, {modifiers: ['series']}, {meta: {type: 'Electricity: part 1'}})}
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
    context: {promo: Object.assign({}, promo, {meta: {type: 'article'}}, {modifiers: ['standalone']})}
  },
  {
    name: 'lead',
    context: {promo: Object.assign({}, promo, {meta: {type: 'article', displayType: 'lead'}})}
  },
  {
    name: 'regular',
    context: {promo: Object.assign({}, promo, {meta: {type: 'article', displayType: 'regular'}})}
  },
  {
    name: 'with-chapters',
    context: {promo: Object.assign({}, promoInSeries, {type: 'article', displayType: 'regular'})}
  },
  {
    name: 'standalone-with-chapters',
    context: {promo: Object.assign({}, promoInSeries, {meta: {type: 'article'}}, {modifiers: ['standalone']})}
  }
];
