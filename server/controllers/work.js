import {List} from 'immutable';
import {createPageConfig} from '../model/page-config';
import {getWork, getWorks} from '../services/wellcomecollection-api';
import {createResultsList} from '../model/results-list';
import {PaginationFactory} from '../model/pagination';
import {isFlagEnabled, getFlagValue} from '../util/flag-status';
import {worksLandingPromos, henryImage} from '../data/works';
import getLicenseInfo from '../filters/get-license-info';

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

function constructCreatorsString(creators) {
  if (creators.length > 0) {
    const creatorsString =  creators.reduce((acc, creator, index) => {
      if (index === 0) {
        return `${acc} ${creator.label}`;
      } else if (index + 1 === creators.length) {
        return `${acc} and ${creator.label}`;
      } else {
        return `${acc}, ${creator.label}`;
      }
    }, 'by');
    return creatorsString;
  } else {
    return '';
  }
}

function constructLicenseString(licenseType) {
  const licenseInfo = getLicenseInfo(licenseType);
  return `<a href="${licenseInfo.url}">${licenseInfo.text}</a>`;
}

function constructAttribution(singleWork, credit, canonicalUri) {
  const title = singleWork.title ? `'${singleWork.title}' ` : '';
  const creators = constructCreatorsString(singleWork.creators);
  const license = constructLicenseString(singleWork.thumbnail.license.licenseType);
  return `<p>${title} ${creators}. Credit: <a href="${canonicalUri}">${credit}</a>. ${license}</p>`;
}

export const work = async(ctx, next) => {
  const id = ctx.params.id;
  const queryString = ctx.search;
  const singleWork = await getWork(id, getImageIndex(ctx));
  const descriptionArray = singleWork.description && singleWork.description.split('\n');
  const truncatedTitle = singleWork.title && getTruncatedTitle(singleWork.title);
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
  const canonicalUri = `${ctx.globals.rootDomain}/works/${singleWork.id}`;
  const credit = singleWork.items[0].locations[0].copyright;
  const attribution = constructAttribution(singleWork, credit, canonicalUri);

  ctx.render('pages/work', {
    id,
    queryString,
    pageConfig: createPageConfig({
      title: truncatedTitle,
      inSection: 'images',
      category: 'collections',
      canonicalUri: canonicalUri
    }),
    work: Object.assign({}, singleWork, {
      descriptionArray,
      imgLink,
      imgWidth,
      encoreLink,
      attribution,
      credit
    })
  });

  return next();
};

export const search = async (ctx, next) => {
  const { query, page } = ctx.query;
  const queryString = ctx.search;
  const results = query && query.trim() !== '' ? await getWorks(query, page && Number(page), getImageIndex(ctx)) : null;
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
    queryString,
    promos: worksLandingPromos,
    henryImage: henryImage
  });
  return next();
};
