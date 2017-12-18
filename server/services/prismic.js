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
  parsePromoListItem, parseEventFormat, parseEventBookingType, parseImagePromo
} from './prismic-parsers';
import {List} from 'immutable';
import moment from 'moment';
import type {PaginatedResults, PaginatedResultsType} from '../model/paginated-results';
import type {ExhibitionPromo} from '../model/exhibition-promo';
import type {ExhibitionAndRelatedContent} from '../model/exhibition-and-related-content';
import {PaginationFactory} from '../model/pagination';
import type {EventPromo} from '../content-model/events';

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
  'event-access-options.title', 'event-access-options.description', 'event-access-options.description',
  'event-booking-enquiry-teams.title', 'event-booking-enquiry-teams.email', 'event-booking-enquiry-teams.phone',
  'event-booking-enquiry-teams.url',
  'event-contributor-roles.title',
  'event-formats.title', 'event-formats.description', 'event-formats.shortName',
  'event-programmes.title',
  'locations.title', 'locations.geolocation', 'locations.level', 'locations.capacity'
];

const defaultPageSize = 40;

function london(d) {
  return moment.tz(d, 'Europe/London');
}

export async function getPrismicApi(req: ?Request) {
  const api = req ? await prismicPreviewApi(req) : await prismicApi();

  return api;
}

async function getTypeById(req: ?Request, types: Array<DocumentType>, id: string, qOpts: Object<any>) {
  const prismic = await getPrismicApi(req);
  const doc = await prismic.getByID(id, qOpts);
  return doc && types.indexOf(doc.type) !== -1 ? doc : null;
}

type PrismicQueryOptions = {|
  fetchLinks?: ?Array<String>;
  orderings?: ?string;
|}

async function getAllOfType(type: DocumentType, page: number, options: PrismicQueryOptions = {}) {
  const prismic = await getPrismicApi();
  const results = await prismic.query([
    Prismic.Predicates.any('document.type', [type])
  ], Object.assign({}, { page, pageSize: defaultPageSize }, options));
  return results;
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

function createExhibitionPromos(allResults: Object): Array<ExhibitionPromo> {
  return allResults.map((e):ExhibitionPromo => {
    return {
      id: e.id,
      url: `/exhibitions/${e.id}`,
      title: asText(e.data.title),
      image: e.data.promo && parseImagePromo(e.data.promo).image,
      description: e.data.promo && parseImagePromo(e.data.promo).caption,
      start: e.data.start ? e.data.start : '2007-06-21T00:00:00+0000',
      end: e.data.end
    };
  });
}

function createEventPromos(allResults): Array<EventPromo> {
  return allResults.map((event): EventPromo => {
    const promo = event.data.promo && parseImagePromo(event.data.promo);
    const format = event.data.format && parseEventFormat(event.data.format);
    const bookingType = parseEventBookingType(event);

    // A single Primsic 'event' can have multiple datetimes, but we
    // want to display each datetime as an individual promo, so we
    // map and flatten.
    return event.data.times.map(eventAtTime => {
      return {
        id: event.id,
        title: asText(event.data.title),
        url: `/events/${event.id}`,
        format: format,
        start: eventAtTime.startDateTime,
        end: eventAtTime.endDateTime,
        image: promo && promo.image,
        description: promo && promo.caption,
        bookingType: bookingType
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

function convertPrismicResultsToPaginatedResults(prismicResults: Object): (results: PaginatedResultsType) => PaginatedResults {
  const currentPage = prismicResults && prismicResults.page;
  const pageSize = prismicResults && prismicResults.results_per_page;
  const totalResults = prismicResults && prismicResults.total_results_size;
  const totalPages = prismicResults && prismicResults.total_pages;
  const pagination = PaginationFactory.fromList(List(prismicResults.results), parseInt(totalResults, 10) || 1, parseInt(currentPage, 10) || 1, pageSize || 1);

  return (results) => {
    return {
      results,
      currentPage,
      pageSize,
      totalResults,
      totalPages,
      pagination
    };
  };
}

export async function getPaginatedEventPromos(page: number): Promise<Array<EventPromo>> {
  const events = await getAllOfType('events', page, {
    orderings: '[my.events.times.startDateTime desc]',
    fetchLinks: eventFields
  });
  const promos = createEventPromos(events.results);
  const paginatedResults = convertPrismicResultsToPaginatedResults(events);
  return paginatedResults(promos);
}

export async function getPaginatedExhibitionPromos(page: number): Promise<Array<ExhibitionPromo>> {
  const exhibitions = await getAllOfType('exhibitions', page, {orderings: '[my.exhibitions.start]'});
  const promos = createExhibitionPromos(exhibitions.results);
  const paginatedResults = convertPrismicResultsToPaginatedResults(exhibitions);
  return paginatedResults(promos);
}

// TODO flowtype
function datesOverlapRange (eventStartDate, eventEndDate, rangeStartDate, rangeEndDate) {
  if (rangeStartDate && rangeEndDate) {
    const eventStart = london(eventStartDate);
    const eventEnd = london(eventEndDate);
    const rangeStart = london(rangeStartDate);
    const rangeEnd = london(rangeEndDate);
    return (eventStart.isSame(rangeEnd, 'day') || eventStart.isBefore(rangeEnd, 'day')) && (eventEnd.isSame(rangeStart, 'day') || eventEnd.isAfter(rangeStart, 'day'));
  } else {
    return true;
  }
}

// TODO flowtype
function filterPromosByDate(promos, startDate, endDate) {
  return promos.filter(e => datesOverlapRange(e.start, e.end, startDate, endDate));
}

// TODO flowtype
export async function getExhibitionAndEventPromos(queryDates) {
  const dateRange = queryDates && queryDates.split('|');
  const fromDate = dateRange && dateRange[0];
  const toDate = dateRange && dateRange[1];
  const prismic = await getPrismicApi();
  const allExhibitionsAndEvents = await prismic.query([
    Prismic.Predicates.any('document.type', ['exhibitions', 'events'])
  ]);
  const exhibitionPromos = createExhibitionPromos(allExhibitionsAndEvents.results.filter(e => e.type === 'exhibitions'));
  const permanentExhibitionPromos = exhibitionPromos.filter(e => !e.end);
  const temporaryExhibitionPromos = filterPromosByDate(exhibitionPromos.filter(e => e.end), fromDate, toDate);
  const eventPromos = filterPromosByDate(createEventPromos(allExhibitionsAndEvents.results.filter(e => e.type === 'events')), fromDate, toDate);
  const todaysDate = london();
  const dates = {
    today: todaysDate.format('YYYY-MM-DD'),
    weekend: [getWeekendFromDate(todaysDate).format('YYYY-MM-DD'), getWeekendToDate(todaysDate).format('YYYY-MM-DD')],
    queriedDates: dateRange
  };

  return {
    dates,
    permanentExhibitionPromos,
    temporaryExhibitionPromos,
    eventPromos
  };
}

// TODO flowtype
function getWeekendFromDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger !== 0) {
    return london(today).day(5);
  } else {
    return london(today).day(-2);
  }
}

// TODO flowtype
function getWeekendToDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger === 0) {
    return london(today);
  } else {
    return london(today).day(7);
  }
}

// TODO function to return everything split by month

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
