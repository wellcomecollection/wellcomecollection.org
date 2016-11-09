const {get} = require('../util/https');
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
      host: 'wellcomecollection.org',
      path: `/api/v0/${id}`
    };

    const json = await get(uri);
    return ctx.render('article/index', Article.fromDrupalApi(json));
  },
  favicon: (ctx) => ctx.body = '',
  healthcheck: (ctx) => ctx.body = 'ok'
};
