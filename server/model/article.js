import bodyParser from '../util/body-parser';

export default class Article {
  constructor(headline, articleBody, mainImage) {
    this.headline = headline;
    this.articleBody = articleBody;
    this.mainImage = mainImage;
    this.bodyParts = Article.getBodyParts(articleBody);
  }

  static getBodyParts(body) {
    return bodyParser(body);
  }

  static fromLibraryApi(json) {
    return new Article(json.title.rendered, json.content.rendered);
  }

  static fromExploreApi(json) {
    return new Article(json.headline, json.articleBody, json.mainImage);
  }
}
