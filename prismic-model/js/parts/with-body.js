import articles from '../../json/articles.json';

export default function withBody(model) {
  return {...model, ...{Body: {body: articles.Article.body}}};
}
