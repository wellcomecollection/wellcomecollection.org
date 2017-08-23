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

function shouldGetImageFromOrigin(ctx) {
  const [flags] = ctx.intervalCache.get('flags');
  const useOrigin = isFlagEnabled(ctx.featuresCohort, 'imagesFromOrigin', flags);

  return useOrigin;
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
  const requestHost = `${ctx.request.protocol}://${ctx.request.host}`;
  const requestPath = ctx.request.path;

  ctx.render('pages/work', {
    id,
    queryString,
    requestHost,
    requestPath,
    pageConfig: createPageConfig({
      title: 'Work',
      inSection: 'explore',
      category: 'collections'
    }),
    work: Object.assign({}, singleWork, {
      imgLink,
      imgWidth
    })
  });

  return next();
};

function getResultsWithImages(results, useIiif, useOrigin) {
  if (!results) return;

  if (results.error) {
    // Display some error messaging to the user here?
    console.error(results.error);

    return;
  }

  return results.results.map((result) => {
    const miroId = result.identifiers[0].value;
    const imgLink = imageUrlFromMiroId(miroId, useIiif, useOrigin);
    return Object.assign({}, result, {imgLink});
  });
}

export const search = async (ctx, next) => {
  const { query, page } = ctx.query;
  const queryString = ctx.search;
  const results = query && query.trim() !== '' ? await getWorks(query, page) : null;
  const resultsWithImages = getResultsWithImages(results, shouldUseIiif(ctx), shouldGetImageFromOrigin(ctx));
  const pageSize = results && results.pageSize;
  const totalPages = results && results.totalPages;
  const totalResults = (results && results.totalResults) || 0;
  const resultsList = createResultsList({
    results: resultsWithImages,
    pageSize,
    totalPages,
    totalResults
  });

  const pagination = PaginationFactory.fromList(List(resultsWithImages), parseInt(totalResults, 10) || 1, parseInt(page, 10) || 1, pageSize || 1, ctx.query);
  ctx.render('pages/search', {
    pageConfig: createPageConfig({
      inSection: 'index'
    }),
    resultsList,
    query,
    pagination,
    queryString
  });
  return next();
};
