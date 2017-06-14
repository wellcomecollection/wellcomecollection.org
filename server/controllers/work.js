import {createPageConfig} from '../model/page-config';
import {getWork} from '../services/wellcomecollection-api';

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
