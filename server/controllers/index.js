const {get} = require('../util/http');
const Article = require('../model/article');

module.exports = {
  article: async (ctx) => {
    const id = ctx.params.id;
    const uri = {
      host: 'blog.wellcomelibrary.org',
      path: `/wp-json/wp/v2/posts/${id}`
    };

    const json = await get(uri);
    return ctx.render('article/index', Article.fromWordpressData(json));
  },
  healthcheck: (ctx) => ctx.body = 'ok'
};
