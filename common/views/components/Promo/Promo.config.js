import {ArticleStubFactory} from '../../../../server/model/article-stub';
import mockJson from '../../../../server/test/mocks/wp-api.json';

export const name = 'Promo';
export const handle = 'promo';
export const collated = true;
export const status = 'graduated';

const promo = ArticleStubFactory.fromWpApi(mockJson);

export const context = {
  contentType: 'article',
  image: promo.thumbnail,
  title: promo.headline,
  url: promo.url,
  description: promo.description
};

const commissionedSeries = {
  url: '/series/electricity',
  name: 'Electricity',
  commissionedLength: 5,
  color: 'purple',
  // $FlowFixMe for the items
  items: [{}, {}, {}]
};

const namedSeries = Object.assign({}, commissionedSeries, {name: 'Body Squabbles'});
const promoWithCommissionedSeries = Object.assign({}, promo, {series: [commissionedSeries], positionInSeries: 3});
const promoWithNamedSeries = Object.assign({}, promo, {series: [namedSeries]});

export const variants = [
  {
    name: 'series-article',
    context: Object.assign({}, promoWithCommissionedSeries, {modifiers: ['series']}, {contentType: 'series'})
  },
  {
    name: 'gallery',
    context: Object.assign({}, promo, {modifiers: ['underlined']}, {contentType: 'gallery'})
  },
  {
    name: 'audio',
    context: Object.assign({}, promo, {modifiers: ['underlined']}, { contentType: 'audio', length: '01:35' })
  },
  {
    name: 'video',
    context: Object.assign({}, promo, {modifiers: ['underlined']}, { contentType: 'video', length: '01:35' })
  },
  {
    name: 'comic',
    context: Object.assign({}, promoWithNamedSeries, {contentType: 'comic'})
  },
  {
    name: 'standalone',
    context: Object.assign({}, promo, {contentType: 'article'}, {modifiers: ['standalone']})
  },
  {
    name: 'featured',
    context: Object.assign({}, promo, {contentType: 'article', weight: 'featured'})
  },
  {
    name: 'regular',
    context: Object.assign({}, promo, {contentType: 'article', weight: 'regular'})
  },
  {
    name: 'with-chapters',
    context: Object.assign({}, promoWithCommissionedSeries, {contentType: 'article', weight: 'featured'})
  },
  {
    name: 'standalone-with-chapters',
    context: Object.assign({}, promoWithCommissionedSeries, {contentType: 'article', weight: 'featured'}, {modifiers: ['standalone']})
  }
];
