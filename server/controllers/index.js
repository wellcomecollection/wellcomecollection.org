const {get} = require('../util/http');
const Article = require('../model/article');

module.exports = {
  patterns: {
    index: (ctx) => ctx.render('patterns/index', {}),
    typography: (ctx) => ctx.render('patterns/typography', {}),
    grids: (ctx) => ctx.render('patterns/grids', {}),
    palette: (ctx) => ctx.render('patterns/palette', {}),
    icons: (ctx) => ctx.render('patterns/icons', {})
  },
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
