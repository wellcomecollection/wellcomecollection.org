import {createPageConfig} from '../model/page-config';
import {getWork, getWorks} from '../services/wellcomecollection-api';
import {createResultsList} from '../model/results-list';
import {PaginationFactory} from '../model/pagination';
import {List} from 'immutable';

function imageUrlFromMiroId(id) {
  const cleanedMiroId = id.match(/(^\w{1}[0-9]*)+/g, '')[0];
  const miroFolder = `${cleanedMiroId.slice(0, -3)}000`;
  return `http://s3-eu-west-1.amazonaws.com/miro-images-public/${miroFolder}/${id}.jpg`;
}

export const work = async(ctx, next) => {
  const id = ctx.params.id;
  const singleWork = await getWork(id);
  const miroId = singleWork.identifiers[0].value;
  const imgLink = imageUrlFromMiroId(miroId);

  ctx.render('pages/work', {
    pageConfig: createPageConfig({
      title: 'Work',
      inSection: 'explore'
    }),
    work: Object.assign({}, singleWork, {imgLink})
  });

  return next();
};


function getResultsWithImages(results) {
  if (!results) return;

  if (results.error) {
    // Display some error messaging to the user here?
    console.error(results.error);

    return;
  }

  return results.results.map((result) => {
    const miroId = result.identifiers[0].value;
    const imgLink = imageUrlFromMiroId(miroId);
    return Object.assign({}, result, {imgLink});
  });
}

export const search = async (ctx, next) => {
  const { query, page } = ctx.query;
  const results = query && query.trim() !== '' ? await getWorks(query, page) : null;
  const resultsWithImages = getResultsWithImages(results);
  const pageSize = results && results.pageSize ? results.pageSize : null;
  const totalPages = results && results.totalPages ? results.totalPages : null;
  const totalResults = results && results.totalResults ? results.totalResults : null;
  const resultsList = createResultsList({
    results: resultsWithImages,
    pageSize,
    totalPages,
    totalResults
  });
  const pagination = PaginationFactory.fromList(List(resultsWithImages), parseInt(totalResults, 10) || 1, parseInt(page, 10) || 1, pageSize || 1);
  ctx.render('pages/search', {
    pageConfig: createPageConfig({inSection: 'index'}),
    resultsList,
    query,
    pagination
  });
  return next();
};
