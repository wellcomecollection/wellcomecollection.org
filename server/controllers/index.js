const {get} = require('../util/https');
const Article = require('../model/article');

module.exports = {
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
