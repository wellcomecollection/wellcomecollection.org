// @flow
import {createPromo} from '../../../model/promo';
import {ArticleStubFactory} from '../../../model/article-stub';
import mockJson from '../../../test/mocks/wp-api.json';

const article = ArticleStubFactory.fromWpApi(mockJson);
export const name = 'Transporter';
export const handle = 'transporter';
export const collated = true;

const articleWithoutDescription = Object.assign({}, article, {description: ''});
const promo = createPromo({
  contentType: 'article',
  modifiers: ['transporter-child'],
  image: article.thumbnail,
  title: article.headline,
  url: article.url
});

export const transporter = {
  title: 'Latest articles',
  promos: [promo, promo, promo]
};

export const context = transporter;

export const variants = [
  {
    name: 'theme',
    context: Object.assign({}, transporter, {
      type: 'theme',
      title: 'Mind control',
      introCopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    })
  }
];
