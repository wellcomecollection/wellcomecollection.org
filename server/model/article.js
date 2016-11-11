export default class Article {
  constructor(headline, articleBody, mainImage) {
    this.headline = headline;
    this.articleBody = articleBody;
    this.mainImage = mainImage;
  }

  static fromDrupalApi(json) {
    return new Article(json.headline, json.articleBody, json.mainImage);
  }
}
