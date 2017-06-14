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
  const results = query && query.trim() !== '' ? await getWorks(query) : null;
  const resultsWithImages = results ? results.results.map((result) => {
    const miroID = result.identifiers[0].value;
    const miroFolder = `${miroID.slice(0, -3)}000`;
    const imgLink = `http://s3-eu-west-1.amazonaws.com/miro-images-public/${miroFolder}/${miroID}.jpg`;
    return Object.assign({}, result, {imgLink});
  }) : null;
  ctx.render('pages/search', {
    pageConfig: createPageConfig({inSection: 'index'}),
    results: resultsWithImages
  });
  return next();
};
