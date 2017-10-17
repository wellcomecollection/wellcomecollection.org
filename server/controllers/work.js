import {List} from 'immutable';
import {createPageConfig} from '../model/page-config';
import {getWork, getWorks} from '../services/wellcomecollection-api';
import {createResultsList} from '../model/results-list';
import {PaginationFactory} from '../model/pagination';
import {isFlagEnabled, getFlagValue} from '../util/flag-status';

function imageUrlFromMiroId(id) {
  const cleanedMiroId = id.match(/(^\w{1}[0-9]*)+/g, '')[0];
  const miroFolder = `${cleanedMiroId.slice(0, -3)}000`;

  return `https://s3-eu-west-1.amazonaws.com/miro-images-public/${miroFolder}/${id}.jpg`;
}

function encoreLinkFromSierraId(id) {
  return `http://search.wellcomelibrary.org/iii/encore/record/C__R${id}`;
}

function getTruncatedTitle(title) {
  if (title.length <= 20) {
    return title;
  } else {
    return `${title.slice(0, 20)}…`;
  }
}

function getImageIndex(ctx) {
  const [flags] = ctx.intervalCache.get('flags');
  const imageIndex = isFlagEnabled(ctx.featuresCohort, 'imageIndex', flags) && getFlagValue(ctx.featuresCohort, 'imageIndex', flags);
  return imageIndex;
}

export const work = async(ctx, next) => {
  const id = ctx.params.id;
  const queryString = ctx.search;
  const singleWork = await getWork(id, getImageIndex(ctx));
  const descriptionArray = singleWork.description && singleWork.description.split('\n');
  const truncatedTitle = getTruncatedTitle(singleWork.title);
  const miroIdObject = singleWork.identifiers.find(identifier => {
    return identifier.identifierScheme === 'miro-image-number';
  });
  const miroId = miroIdObject && miroIdObject.value;
  const sierraIdObject = singleWork.identifiers.find(identifier => {
    return identifier.identifierScheme === 'sierra-system-number';
  });
  const sierraId = sierraIdObject && sierraIdObject.value;
  const imgWidth = '800';
  const imgLink = imageUrlFromMiroId(miroId);
  const encoreLink = sierraId && encoreLinkFromSierraId(sierraId);

  console.info(imgWidth, imgLink, encoreLink);

  ctx.render('pages/work', {
    id,
    queryString,
    pageConfig: createPageConfig({
      title: `Work: ${truncatedTitle}`,
      inSection: 'images',
      category: 'collections',
      canonicalUri: `${ctx.globals.rootDomain}/works/${singleWork.id}`
    }),
    work: Object.assign({}, singleWork, {
      descriptionArray,
      imgLink,
      imgWidth,
      encoreLink
    })
  });

  return next();
};

export const search = async (ctx, next) => {
  const { query, page } = ctx.query;
  const queryString = ctx.search;
  const results = query && query.trim() !== '' ? await getWorks(query, Number(page), getImageIndex(ctx)) : null;
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
      title: query ? `Collections search: ${query}` : 'Collections search',
      path: path,
      inSection: 'images',
      canonicalUri: `${ctx.globals.rootDomain}/works`
    }),
    resultsList,
    query,
    pagination,
    queryString
  });
  return next();
};
