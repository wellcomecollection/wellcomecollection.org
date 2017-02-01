import { Promo } from '../../../model/promo';
import Article from '../../../model/article';
import mockJson from '../../../test/mocks/wp-api.json';

const article = Article.fromWpApi(mockJson);
const image = article.mainImage.get('contentUrl');
const alt = article.mainImage.get('caption');
const copy = article.bodyParts.find(part => part.get('type') === 'standfirst').value;
const title = article.headline;

export const name = 'Promo';
export const handle = 'promo';
export const collated = true;

export const promo = new Promo({
  modifiers: ['underline'],
  url: '#',
  image: {sources: [{src: image}], alt: alt},
  title: title,
  copy: copy,
  meta: {
    type: 'article'
  }
}).toJS();

export const context = { promo };
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
    context: {promo: Object.assign({}, promo, {modifiers: ['series', 'standalone']})}
  }
];
