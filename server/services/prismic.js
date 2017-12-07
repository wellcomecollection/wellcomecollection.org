import Prismic from 'prismic-javascript';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import {
  parseArticleDoc,
  parseEventDoc,
  parseWebcomicDoc,
  asText,
  prismicImage,
  parseExhibitionsDoc,
  getPositionInPrismicSeries,
  parsePromoListItem
} from './prismic-parsers';
import {List} from 'immutable';
import type {PaginatedResults} from '../model/paginated-results';
import type {ExhibitionPromo} from '../model/exhibition-promo';
import type {ExhibitionAndRelatedContent} from '../model/exhibition-and-related-content';
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
  'event-access-options.title', 'event-access-options.description', 'event-access-options.acronym',
  'event-booking-enquiry-teams.title', 'event-booking-enquiry-teams.email', 'event-booking-enquiry-teams.phone',
  'event-booking-enquiry-teams.url',
  'event-contributor-roles.title',
  'event-formats.title', 'event-formats.shortName',
  'event-programmes.title',
  'locations.title', 'locations.geolocation', 'locations.level', 'locations.capacity'
];

export async function getPrismicApi(req: ?Request) {
  const api = req ? await prismicPreviewApi(req) : await prismicApi();

  return api;
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
  const exhibitions = await prismic.query([
    Prismic.Predicates.any('document.type', ['exhibitions'])
  ], { orderings: '[my.exhibitions.start desc]', page, pageSize });
  return exhibitions;
}

async function convertResultsToPromos(allResults, type) {
  switch (type) {
    case 'exhibition':
      const exhibitionPromos = await createExhibitionPromos(allResults);

      return exhibitionPromos;
    case 'event':
      const eventPromos = await createEventPromos(allResults);

      return eventPromos;
  }
}

function createExhibitionPromos(allResults: Object): Array<ExhibitionPromo> {
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

function createEventPromos(allResults): Array<EventPromo> {
  return allResults.results.map((event): EventPromo => {
    const promo = event.data.promo && event.data.promo[0];
    const promoImage = promo && promo.primary.image;
    const promoCaption = promo && promo.primary.caption;

    // A single Primsic 'event' can have multiple datetimes, but we
    // want to display each datetime as an individual promo, so we
    // map and flatten.
    return event.data.times.map(eventAtTime => {
      return {
        id: event.id,
        title: asText(event.data.title),
        url: `/events/${event.id}`,
        start: eventAtTime.startDateTime,
        end: eventAtTime.endDateTime,
        image: prismicImage(promoImage),
        description: asText(promoCaption)
      };
    });
  }).reduce((acc, curr) => {
    return curr.concat(acc);
  }, []).sort((a, b) => {
    return convertStringToNumber(b.start || '') - convertStringToNumber(a.start || '');
  });
}

function convertStringToNumber(string: string): number {
  return Number(string.replace(/\D/g, ''));
}

async function getResults(page: number, type: string): Promise<any> { // TODO make type its own enumerable thing}
  switch (type) {
    case 'exhibition':
      const exhibitions = getExhibitions(page);

      return exhibitions;
    case 'event':
      const events = getEvents(page);
      return events;
  }
}

export async function getPaginatedResults(page: number, type: string): Promise<PaginatedResults> { // TODO make type its
  const allResults = await getResults(page, type);
  const currentPage = allResults && allResults.page;
  const pageSize = allResults && allResults.results_per_page;
  const totalResults = allResults && allResults.total_results_size;
  const totalPages = allResults && allResults.total_pages;
  const pagination = PaginationFactory.fromList(List(allResults.results), parseInt(totalResults, 10) || 1, parseInt(page, 10) || 1, pageSize || 1);

  const promos = await convertResultsToPromos(allResults, type);

  return {
    currentPage,
    totalPages,
    results: promos,
    pagination
  };
}

async function getEvents(page:number = 1, pageSize:number = 40) {
  const prismic = await getPrismicApi();
  const events = await prismic.query([
    Prismic.Predicates.any('document.type', ['events'])
  ], {page, pageSize}); // TODO: add orderings by first time in times ?

  return events;
}

export async function getExhibitionAndRelatedContent(id: string, previewReq: ?Request): Promise<?ExhibitionAndRelatedContent> {
  const exhibition = await getTypeById(previewReq, ['exhibitions'], id, {});

  if (!exhibition) { return null; }

  const ex = parseExhibitionsDoc(exhibition);

  const galleryLevel = exhibition.data.galleryLevel;
  const promoList = exhibition.data.promoList;
  const relatedArticles = promoList.filter(x => x.type === 'article').map(parsePromoListItem);
  const relatedEvents = promoList.filter(x => x.type === 'event').map(parsePromoListItem);
  const relatedBooks = promoList.filter(x => x.type === 'book').map(parsePromoListItem);
  const relatedGalleries = promoList.filter(x => x.type === 'gallery').map(parsePromoListItem);

  const sizeInKb = Math.round(exhibition.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = Object.assign({}, exhibition.data.textAndCaptionsDocument, {sizeInKb});

  return {
    exhibition: ex,
    galleryLevel: galleryLevel,
    textAndCaptionsDocument: textAndCaptionsDocument.url && textAndCaptionsDocument,
    relatedBooks: relatedBooks,
    relatedEvents: relatedEvents,
    relatedGalleries: relatedGalleries,
    relatedArticles: relatedArticles
  };
}
