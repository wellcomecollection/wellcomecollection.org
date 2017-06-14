import {createPageConfig} from '../model/page-config';
import {getWork, getWorks} from '../services/wellcomecollection-api';

export const work = async(ctx, next) => {
  const id = ctx.params.id;
  const singleWork = await getWork(id);

  ctx.render('pages/work', {
    pageConfig: createPageConfig({
      title: 'Work',
      inSection: 'explore'
    }),
    work: singleWork
  });

  return next();
};

export const search = async (ctx, next) => {
  const { query } = ctx.query;
  const results = await getWorks(query);
  ctx.render('pages/search', {
    pageConfig: createPageConfig({inSection: 'index'}),
    results: results
  });
  return next();
};
