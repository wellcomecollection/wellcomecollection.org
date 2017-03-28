// @flow
import {List} from 'immutable';
import {type Promo, createPromo} from '../../../model/promo';
import {ArticleStubFactory} from '../../../model/article-stub';
import mockJson from '../../../test/mocks/wp-api.json';
import {type Series} from "../../../model/series";

const article = ArticleStubFactory.fromWpApi(mockJson);
export const name = 'Promo';
export const handle = 'promo';
export const collated = true;

export const promo = createPromo(({
  contentType: 'article',
  image: article.thumbnail,
  title: article.headline,
  url: article.url
}: Promo));

export const context = { promo };

const series: Series = {
  url: '/series/electricity',
  name: 'Electricity',
  total: 5,
  color: 'purple',
  // $FlowFixMe for the items
  items: List([1,2,3,4,5])
};

const promoWithSeries = Object.assign({}, promo, {series, positionInSeries: 3});

export const variants = [
  {
    name: 'series-article',
    context: {promo: Object.assign({}, promo, {modifiers: ['series']}, {contentType: 'series'})}
  },
  {
    name: 'gallery',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined']}, {contentType: 'gallery'})}
  },
  {
    name: 'audio',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined']}, { contentType: 'audio', length: '01:35' })}
  },
  {
    name: 'video',
    context: {promo: Object.assign({}, promo, {modifiers: ['underlined']}, { contentType: 'video', length: '01:35' })}
  },
  {
    name: 'standalone',
    context: {promo: Object.assign({}, promo, {contentType: 'article'}, {modifiers: ['standalone']})}
  },
  {
    name: 'lead',
    context: {promo: Object.assign({}, promo, {contentType: 'article', weight: 'lead'})}
  },
  {
    name: 'regular',
    context: {promo: Object.assign({}, promo, {contentType: 'article', weight: 'regular'})}
  },
  {
    name: 'with-chapters',
    context: {promo: Object.assign({}, promoWithSeries, {contentType: 'article', weight: 'lead'})}
  },
  {
    name: 'standalone-with-chapters',
    context: {promo: Object.assign({}, promoWithSeries, {contentType: 'article', weight: 'lead'}, {modifiers: ['standalone']})}
  }
];
