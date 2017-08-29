import {List} from 'immutable';
import {createPageConfig} from '../model/page-config';
import {getWork, getWorks} from '../services/wellcomecollection-api';
import {createResultsList} from '../model/results-list';
import {PaginationFactory} from '../model/pagination';
import {isFlagEnabled} from '../util/flag-status';

function imageUrlFromMiroId(id, useIiif, useOrigin) {
  const cleanedMiroId = id.match(/(^\w{1}[0-9]*)+/g, '')[0];
  const miroFolder = `${cleanedMiroId.slice(0, -3)}000`;

  if (useIiif) {
    if (useOrigin) {
      return `https://iiif-origin.wellcomecollection.org/image/${id}.jpg/full/WIDTH,/0/default.jpg/`;
    } else {
      return `https://iiif.wellcomecollection.org/image/${id}.jpg/full/WIDTH,/0/default.jpg`;
    }
  } else {
    return `https://s3-eu-west-1.amazonaws.com/miro-images-public/${miroFolder}/${id}.jpg`;
  }
}

function shouldUseIiif(ctx) {
  const [flags] = ctx.intervalCache.get('flags');
  const useIiif = isFlagEnabled(ctx.featuresCohort, 'useIiif', flags);

  return useIiif;
}

export const work = async(ctx, next) => {
  const id = ctx.params.id;
  const queryString = ctx.search;
  const singleWork = await getWork(id);

  const miroId = singleWork.identifiers[0].value;
  const imgWidth = '2048';
  const imgLink = imageUrlFromMiroId(miroId, shouldUseIiif(ctx));

  ctx.render('pages/work', {
    id,
    queryString,
    pageConfig: createPageConfig({
      title: 'Work',
      inSection: 'explore',
      category: 'collections',
      canonicalUri: `${ctx.globals.rootDomain}/works/${singleWork.id}`
    }),
    work: Object.assign({}, singleWork, {
      imgLink,
      imgWidth
    })
  });

  return next();
};

export const search = async (ctx, next) => {
  const { query, page } = ctx.query;
  const queryString = ctx.search;
  const results = query && query.trim() !== '' ? await getWorks(query, page) : null;
  const resultsArray = results && results.results || [];
  const pageSize = results && results.pageSize;
  const totalPages = results && results.totalPages;
  const totalResults = (results && results.totalResults) || 0;
  const resultsList = createResultsList({
    results: resultsArray,
    pageSize,
    totalPages,
    totalResults
  });
  const path = ctx.request.url;
  const pagination = PaginationFactory.fromList(List(resultsArray), parseInt(totalResults, 10) || 1, parseInt(page, 10) || 1, pageSize || 1, ctx.query);
  ctx.render('pages/search', {
    pageConfig: createPageConfig({
      path: path,
      inSection: 'index',
      canonicalUri: `${ctx.globals.rootDomain}/works`
    }),
    resultsList,
    query,
    pagination,
    queryString
  });
  return next();
};
