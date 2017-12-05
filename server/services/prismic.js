// @flow
import Prismic from 'prismic-javascript';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import {
  parseArticleDoc,
  parseEventDoc,
  parseWebcomicDoc,
  asText,
  prismicImage,
  getPositionInPrismicSeries
} from './prismic-parsers';
import {List} from 'immutable';
import type {PaginatedResults} from '../model/paginated-results';
import type {Article} from '../model/article';
import type {ExhibitionPromo} from '../model/exhibition-promo';
import {PaginationFactory} from '../model/pagination';

type DocumentType = 'articles' | 'webcomics' | 'events' | 'exhibitions';

const peopleFields = ['people.name', 'people.image', 'people.twitterHandle', 'people.description'];
const booksFields = ['books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover'];
const seriesFields = [
  'series.name',
  'series.description',
  'series.color',
  'series.schedule',
  'series.commissionedLength',
  'series.wordpressSlug'
];
const contributorFields = ['editorial-contributor-roles.title'];
const eventFields = [
  'event-access-options.title', 'event-access-options.acronym',
  'event-booking-enquiry-teams.title', 'event-booking-enquiry-teams.email', 'event-booking-enquiry-teams.phone',
  'event-booking-enquiry-teams.url',
  'event-contributor-roles.title',
  'event-formats.title', 'event-programmes.title'
];

export async function getPrismicApi(req: ?Request) {
  return req ? await prismicPreviewApi(req) : await prismicApi();
}

async function getTypeById(req: ?Request, types: Array<DocumentType>, id: string, qOpts: Object<any>) {
  const prismic = await getPrismicApi(req);
  const doc = await prismic.getByID(id, qOpts);
  return doc && types.indexOf(doc.type) !== -1 ? doc : null;
}

export async function getArticle(id: string, previewReq: ?Request) {
  const fetchLinks = peopleFields.concat(booksFields, seriesFields, contributorFields);
  const article = await getTypeById(previewReq, ['articles', 'webcomics'], id, {fetchLinks});

  if (!article) { return null; }

  switch (article.type) {
    case 'articles': return parseArticleDoc(article);
    case 'webcomics': return parseWebcomicDoc(article);
  }
}

export async function getEvent(id: string, previewReq: ?Request): Promise<?Event> {
  const fetchLinks = eventFields.concat(peopleFields, contributorFields);
  const event = await getTypeById(previewReq, ['events'], id, {fetchLinks});

  if (!event) { return null; }

  return parseEventDoc(event);
}

export async function getArticleList(page = 1, {pageSize = 10, predicates = []} = {}) {
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'series.name', 'series.description', 'series.color', 'series.commissionedLength', 'series.schedule'
  ];
  // TODO: This order is not really doing what we expect it to do.
  const orderings = '[document.first_publication_date desc, my.articles.publishDate desc, my.webcomics.publishDate desc]';
  const prismic = await prismicApi();
  const articlesList = await prismic.query([
    Prismic.Predicates.any('document.type', ['articles', 'webcomics']),
    Prismic.Predicates.not('document.tags', ['delist'])
  ].concat(predicates), {fetchLinks, page, pageSize, orderings});

  const articlesAsArticles = articlesList.results.map(result => {
    switch (result.type) {
      case 'articles': return parseArticleDoc(result);
      case 'webcomics': return parseWebcomicDoc(result);
    }
  });

  // This shape matches the works API
  return ({
    currentPage: page,
    results: articlesAsArticles,
    pageSize: articlesList.results_per_page,
    totalResults: articlesList.total_results_size,
    totalPages: articlesList.total_pages
  }: PaginatedResults);
}

export async function getArticleSeries(seriesId) {
  const prismic = await prismicApi();

  const series = await prismic.getByID(seriesId);

  const schedule = series.data.schedule.map(a => {
    return Object.assign({}, a, {title: asText(a.title)});
  });

  const articlesSchedule = Object.assign({}, series.data, {schedule});

  const publishedFromSeries = await prismic.query([
    Prismic.Predicates.at('my.articles.series.series', seriesId)
  ]);

  const scheduleItems = articlesSchedule.schedule.map(articleInSchedule => {
    const matchingArticle = publishedFromSeries.results.find(publishedArticle => {
      return asText(publishedArticle.data.title).toLowerCase() === articleInSchedule.title.toLowerCase();
    });

    return {
      url: matchingArticle ? `/articles/${matchingArticle.id}` : null,
      contentType: matchingArticle ? 'Article' : null,
      thumbnail: matchingArticle ? prismicImage(matchingArticle.data.promo[0].primary.image) : null,
      headline: articleInSchedule.title,
      datePublished: articleInSchedule.publishDate,
      series: [series.data],
      positionInSeries: matchingArticle ? getPositionInPrismicSeries(series.id, matchingArticle.data.series) : null
    };
  });

  return Object.assign({}, {
    name: articlesSchedule.name,
    description: articlesSchedule.description,
    color: articlesSchedule.color,
    commissionedLength: articlesSchedule.commisionedLength
  }, {items: List(scheduleItems)}, {id: seriesId});
}

export async function getSeriesAndArticles(id: string, page: number = 1) {
  const paginatedResults = await getArticleList(page, {
    predicates: [Prismic.Predicates.at('my.articles.series.series', id)]
  });

  if (paginatedResults.totalResults > 0) {
    const series = paginatedResults.results[0].series[0];
    return {series, paginatedResults};
  }
}

export async function getCuratedList(id: string) {
  const fetchLinks = seriesFields;
  const prismic = await prismicApi();
  const curatedLists = await prismic.query([
    Prismic.Predicates.at('my.curated-lists.uid', id),
    Prismic.Predicates.at('document.type', 'curated-lists')
  ], {fetchLinks});

  const curatedList = curatedLists.results.length > 0 && curatedLists.results[0];

  if (!curatedList) {
    return null;
  }

  return curatedList;
}

async function getExhibitions(page:number = 1, pageSize:number = 40): Promise<any> {
  const prismic = await getPrismicApi();
  const exhibitionsList = await prismic.query([
    Prismic.Predicates.any('document.type', ['exhibitions'])
  ], { orderings: '[my.exhibitions.start desc]', page, pageSize });
  return exhibitionsList;
}

async function createPromos(allResults, type) {
  switch (type) {
    case 'exhibition':
      return await createExhibitionPromos(allResults);
    // case 'event':
    //   return await getEvents(page);
  }
}

async function createExhibitionPromos(allResults: Object): Promise<List<ExhibitionPromo>> {
  const allPromos = allResults.results.map((e):ExhibitionPromo => {
    return {
      id: e.id,
      url: `/exhibitions/${e.id}`,
      title: asText(e.data.title),
      image: prismicImage(e.data.promo[0].primary.image),
      description: asText(e.data.promo[0].primary.caption),
      start: e.data.start ? e.data.start : '2007-06-21T00:00:00+0000',
      end: e.data.end
    };
  });

  const permanentPromos = allPromos.filter((e) => {
    return !e.end;
  });

  const temporaryPromos = allPromos.filter((e) => {
    return e.end;
  });

  return permanentPromos.concat(temporaryPromos);
}

async function getResults(page: number, type: string): Promise<any> { // TODO make type its own enumerable thing}
  switch (type) {
    case 'exhibition':
      return await getExhibitions(page);
    // case 'event':
    //   return await getEvents(page);
  }
}

export async function getPaginatedResults(page: number, type: string): Promise<PaginatedResults> { // TODO make type its
  const allResults = await getResults(page, 'exhibition');
  const currentPage = allResults && allResults.page;
  const pageSize = allResults && allResults.results_per_page;
  const totalResults = allResults && allResults.total_results_size;
  const totalPages = allResults && allResults.total_pages;
  const pagination = PaginationFactory.fromList(List(allResults.results), parseInt(totalResults, 10) || 1, parseInt(page, 10) || 1, pageSize || 1);

  const promos = await createPromos(allResults, type);

  return {
    currentPage,
    totalPages,
    results: promos,
    pagination
  };
}

// export async function getEvents() {

// }

// export async function createEventsPromos() {

// }
