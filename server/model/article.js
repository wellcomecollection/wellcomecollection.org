class Article {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }


  static fromWordpressData(json) {
    return new Article(json.title.rendered, json.content.rendered);
  }
}

module.exports = Article;
