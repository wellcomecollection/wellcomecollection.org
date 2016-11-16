export default class Article {
  constructor(headline, articleBody, mainImage, associatedMedia) {
    this.headline = headline;
    this.articleBody = articleBody;
    this.mainImage = mainImage;
    this.associatedMedia = associatedMedia;
  }

  static fromDrupalApi(json) {
    return new Article(json.headline, json.articleBody, json.mainImage, json.associatedMedia);
  }
}
