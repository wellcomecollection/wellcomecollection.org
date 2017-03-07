// @flow
import {createPromo} from '../../../model/promo';
import {ArticleStubFactory} from '../../../model/article-stub';
import mockJson from '../../../test/mocks/wp-api.json';

const article = ArticleStubFactory.fromWpApi(mockJson);
export const name = 'Transporter';
export const handle = 'transporter';
export const collated = true;
export const display = {
  background: '#eeebe2'
};

const articleWithoutDescription = Object.assign({}, article, {description: ''});
const promo = createPromo({
  modifiers: ['transporter-child'],
  article: articleWithoutDescription,
  meta: {
    type: 'article'
  }
});

export const transporter = {
  title: 'Latest articles',
  promos: [promo, promo, promo]
};

export const context = transporter;

export const variants = [
  {
    name: 'Theme transporter',
    context: Object.assign({}, transporter, {
      type: 'theme',
      title: 'Mind control',
      introCopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    })
  }
];
