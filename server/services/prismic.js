import Prismic from 'prismic-javascript';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import {
  parseArticleDoc,
  parseEventDoc,
  parseWebcomicDoc,
  parseBasicPageDoc,
  asText,
  asHtml,
  prismicImage,
  getPositionInPrismicSeries,
  parseAudience, parseEventFormat, parseEventBookingType,
  parseImagePromo, isEmptyDocLink
} from './prismic-parsers';
import {List} from 'immutable';
import moment from 'moment';
import type {PaginatedResults, PaginatedResultsType} from '../model/paginated-results';
import type {ExhibitionPromo} from '../model/exhibition-promo';
import {PaginationFactory} from '../model/pagination';
import type {EventPromo} from '../content-model/events';
import type {GlobalAlert} from '../../common/model/global-alert';
import {isEmptyObj} from '../utils/is-empty-obj';

type DocumentType = 'articles' | 'webcomics' | 'events' | 'exhibitions';

const peopleFields = ['people.name', 'people.image', 'people.twitterHandle', 'people.description'];
const booksFields = ['books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover'];
const seriesFields = [
  'series.name',
  'series.description',
  'series.color',
  'series.schedule',
  'series.commissionedLength',
  'series.wordpressSlug',
  'webcomic-series.title',
  'webcomic-series.description'
];
const contributorFields = ['editorial-contributor-roles.title'];
const eventFields = [
  'event-access-options.title', 'event-access-options.description', 'event-access-options.description',
  'teams.title', 'teams.email', 'teams.phone', 'teams.url',
  'event-formats.title', 'event-formats.description', 'event-formats.shortName',
  'places.title', 'places.geolocation', 'places.level', 'places.capacity',
  'interpretation-types.title', 'interpretation-types.abbreviation',
  'interpretation-types.description', 'interpretation-types.primaryDescription',
  'audiences.title',
  'event-series.title', 'event-series.description',
  'organisations.name', 'organisations.image',
  'organisations.url', 'background-textures.image'
];

export const defaultPageSize = 40;

export function london(d) {
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

async function getTypeByIds(req: ?Request, types: Array<DocumentType>, ids: Array<string>, qOpts: Object<any>) {
  const prismic = await getPrismicApi(req);
  const doc = await prismic.getByIDs(ids, qOpts);

  return doc;
}

type PrismicQueryOptions = {|
  page?: number;
  fetchLinks?: Array<String>;
  orderings?: string;
|}

async function getAllOfType(type: Array<DocumentType>, options: PrismicQueryOptions = {}, predicates: any[] = [], withDelisted: boolean = false) {
  const prismic = await getPrismicApi();
  const results = await prismic.query([
    Prismic.Predicates.any('document.type', type),
    Prismic.Predicates.not('document.tags', [withDelisted ? '' : 'delist'])
  ].concat(predicates), Object.assign({}, { pageSize: defaultPageSize }, options));
  return results;
}

export async function getGlobalAlert(): GlobalAlert {
  const prismic = await getPrismicApi();
  const globalAlert = await prismic.getSingle('global-alert');

  return {
    text: globalAlert.data.text && asHtml(globalAlert.data.text),
    isShown: globalAlert.data.isShown && globalAlert.data.isShown === 'show'
  };
}

export async function getArticle(id: string, previewReq: ?Request) {
  const fetchLinks = peopleFields.concat(booksFields, seriesFields, contributorFields);
  const article = await getTypeById(previewReq, ['articles', 'webcomics'], id, {fetchLinks});
  if (!article) { return null; }

  switch (article.type) {
    case 'articles':
      return (
        (article.data.displayType === 'basic-page' && Object.assign({}, parseBasicPageDoc(article), {displayType: 'basic'})) ||
        Object.assign({}, parseArticleDoc(article), {displayType: 'article'})
      );
    case 'webcomics': return Object.assign({}, parseWebcomicDoc(article), {displayType: 'article'});
  }
}

export async function getEvent(id: string, previewReq: ?Request): Promise<?Event> {
  const fetchLinks = eventFields.concat(peopleFields, contributorFields, seriesFields);
  const event = await getTypeById(previewReq, ['events'], id, {fetchLinks});

  if (!event) { return null; }

  const scheduleIds = event.data.schedule.map(event => event.event.id);
  const eventScheduleDocs = scheduleIds.length > 0 && await getTypeByIds(previewReq, ['events'], scheduleIds, {fetchLinks});
  return parseEventDoc(event, eventScheduleDocs);
}

export async function getArticleList(page = 1, {pageSize = 10, predicates = []} = {}) {
  const fetchLinks = peopleFields.concat(seriesFields);
  // TODO: This order is not really doing what we expect it to do.
  const orderings = '[my.articles.publishDate, my.webcomics.publishDate, document.first_publication_date desc]';
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

export async function getSeriesAndArticles(id: string, page: number = 1, contentType = 'articles', pageSize = defaultPageSize) {
  const paginatedResults = await getArticleList(page, {
    predicates: [Prismic.Predicates.at(`my.${contentType}.series.series`, id)], pageSize
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
  return allResults.map((e): ExhibitionPromo => {
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

export function createEventPromos(allResults): Array<EventPromo> {
  return allResults.map((event): EventPromo => {
    const promo = event.data.promo && parseImagePromo(event.data.promo);
    const format = event.data.format && parseEventFormat(event.data.format);
    const audience = event.data.audiences.map((audience) => {
      return parseAudience(audience.audience);
    })[0];

    const bookingType = parseEventBookingType(event);
    const interpretations = event.data.interpretations.map(interpretation => !isEmptyDocLink(interpretation.interpretationType) ? ({
      interpretationType: {
        title: asText(interpretation.interpretationType.data.title),
        abbreviation: asText(interpretation.interpretationType.data.abbreviation),
        description: asText(interpretation.interpretationType.data.description),
        primaryDescription: asText(interpretation.interpretationType.data.primaryDescription)
      },
      isPrimary: Boolean(interpretation.isPrimary)
    }) : null).filter(_ => _);

    const eventbriteIdMatch = isEmptyObj(event.data.eventbriteEvent) ? null : /\/e\/([0-9]+)/.exec(event.data.eventbriteEvent.url);
    const eventbriteId = eventbriteIdMatch ? eventbriteIdMatch[1] : null;

    const series = event.data.series.map(series => !isEmptyDocLink(series.series) ? ({
      id: series.series.id,
      title: asText(series.series.data.title),
      description: series.series.data.description
    }) : null).filter(_ => _);

    const schedule = event.data.schedule.filter(s => Boolean(s.event.id));

    // A single Primsic 'event' can have multiple datetimes, but we
    // want to display each datetime as an individual promo, so we
    // map and flatten.
    const hasNotFullyBookedTimes = event.data.times.find(time => !time.isFullyBooked);
    return event.data.times.map(eventAtTime => {
      return {
        id: event.id,
        title: asText(event.data.title),
        url: `/events/${event.id}`,
        format: format,
        audience: audience,
        hasNotFullyBookedTimes: hasNotFullyBookedTimes,
        isFullyBooked: Boolean(eventAtTime.isFullyBooked),
        start: eventAtTime.startDateTime,
        end: eventAtTime.endDateTime,
        image: promo && promo.image || {},
        description: promo && promo.caption,
        bookingType: bookingType,
        interpretations: interpretations,
        eventbriteId: eventbriteId,
        series: series,
        schedule: schedule
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

export function convertPrismicResultsToPaginatedResults(prismicResults: Object): (results: PaginatedResultsType) => PaginatedResults {
  const currentPage = prismicResults && prismicResults.page;
  const pageSize = prismicResults &&  prismicResults.results_per_page;
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

export async function getEventsInSeries(id: string, { page }: PrismicQueryOptions) {
  const events = await getAllOfType(['events'], {
    page,
    orderings: '[my.events.times.startDateTime desc]',
    fetchLinks: eventFields
  }, [Prismic.Predicates.at('my.events.series.series', id)], true);

  return events;
}

export async function getPaginatedEventPromos(page: number): Promise<Array<EventPromo>> {
  const events = await getAllOfType(['events'], {
    page,
    orderings: '[my.events.times.startDateTime desc]',
    fetchLinks: eventFields
  });
  const promos = createEventPromos(events.results);
  const paginatedResults = convertPrismicResultsToPaginatedResults(events);
  return paginatedResults(promos);
}

export async function getPaginatedExhibitionPromos(page: number): Promise<Array<ExhibitionPromo>> {
  const exhibitions = await getAllOfType(['exhibitions'], {page, orderings: '[my.exhibitions.start]'});
  const promos = createExhibitionPromos(exhibitions.results);
  const paginatedResults = convertPrismicResultsToPaginatedResults(exhibitions);
  return paginatedResults(promos);
}

// Returns true if the date range of an event coincides with the date range provided
//                    [_____date range_____]
//          [___event1___]              [___event2___]
//                         [___event3___]
function datesOverlapRange (eventStartDate, eventEndDate, rangeStartDate, rangeEndDate) {
  const eventStart = london(eventStartDate);
  const eventEnd = london(eventEndDate);
  const rangeStart = rangeStartDate && london(rangeStartDate);
  const rangeEnd = rangeEndDate && london(rangeEndDate);

  return (rangeEnd === undefined || eventStart.isSame(rangeEnd, 'day') || eventStart.isBefore(rangeEnd, 'day')) && (eventEnd.isSame(rangeStart, 'day') || eventEnd.isAfter(rangeStart, 'day'));
}

function filterPromosByDate(promos, startDate, endDate) {
  return promos.filter(e => datesOverlapRange(e.start, e.end, startDate, endDate));
}

function filterCurrentExhibitions(promos, todaysDate) {
  return promos.filter((e) => {
    const eventStart = london(e.start);
    const eventEnd = london(e.end);
    return todaysDate.isSame(eventStart, 'day') || todaysDate.isSame(eventEnd, 'day') || todaysDate.isBefore(eventEnd, 'day') && todaysDate.isAfter(eventStart, 'day');
  });
}

function filterUpcomingExhibitions(promos, todaysDate) {
  return promos.filter((e) => {
    const eventStart = london(e.start);
    return todaysDate.isBefore(eventStart, 'day');
  });
}

function getActiveState(today, fromDate, toDate) {
  const rangeStart = fromDate && london(fromDate);
  const rangeEnd = toDate && london(toDate);
  if (rangeStart && !rangeEnd) {
    return 'everything';
  } else if (today.isSame(rangeStart, 'day') && today.isSame(rangeEnd, 'day')) {
    return 'today';
  } else if (rangeStart.isSame(getWeekendFromDate(today), 'day') && rangeEnd.isSame(getWeekendToDate(today), 'day')) {
    return 'weekend';
  }
};

// On the 'everything' view, events are displayed per month
// If an event has dates that span several months (and/or years) it needs to appear for each month
// This function duplicates an event for each month in which it appears and groups the events into the relevant months
function duplicatePromosByMonthYear(promos) {
  return promos.reduce((acc, currEvent) => {
    const start = london(currEvent.start);
    const end = london(currEvent.end);
    if (end.isSame(start, 'month')) {
      const year = start.format('YYYY');
      const month = start.format('MMMM');
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      acc[year][month].push(currEvent);
    } else {
      while (end.isAfter(start) || end.isSame(start, 'month')) {
        const year = start.format('YYYY');
        const month = start.format('MMMM');
        if (!acc[year]) {
          acc[year] = {};
        }
        if (!acc[year][month]) {
          acc[year][month] = [];
        }
        acc[year][month].push(currEvent);
        start.add(1, 'month');
      }
    }
    return acc;
  }, {});
}

function getListHeader(dates, collectionOpeningTimes) {
  const todaysDate = london().startOf('day');
  const todayString = todaysDate.format('dddd');
  const galleryOpeningHours = collectionOpeningTimes.placesOpeningHours && collectionOpeningTimes.placesOpeningHours.find(venue => venue.name === 'Galleries').openingHours;
  const regularOpeningHours = galleryOpeningHours && galleryOpeningHours.regular.find(i => i.dayOfWeek === todayString);
  const exceptionalOpeningHours = galleryOpeningHours && galleryOpeningHours.exceptional && galleryOpeningHours.exceptional.find(i => {
    const dayOfWeek = london(i.overrideDate).startOf('day');
    return todaysDate.isSame(dayOfWeek);
  });
  const todayOpeningHours = exceptionalOpeningHours || regularOpeningHours;
  const todayDateString = `startDate=${dates.today}&endDate=${dates.today}`;
  const weekendDateString = `startDate=${dates.weekend[0]}&endDate=${dates.weekend[1]}`;
  const allDateString = `startDate=${dates.all[0]}`;
  const urlBeginning = `${encodeURI('/whats-on?')}`;

  return {
    todayOpeningHours,
    name: 'What\'s on',
    items: [
      {
        id: 'everything',
        title: 'Everything',
        url: `${urlBeginning}${encodeURI(allDateString)}`
      },
      {
        id: 'today',
        title: 'Today',
        url: `${urlBeginning}${encodeURI(todayDateString)}`
      },
      {
        id: 'weekend',
        title: 'This weekend',
        url: `${urlBeginning}${encodeURI(weekendDateString)}`
      }
    ]
  };
}

export async function getExhibitionAndEventPromos(query, collectionOpeningTimes, featuresCohort) {
  const todaysDate = london();
  const fromDate = !query.startDate ? todaysDate.format('YYYY-MM-DD') : query.startDate;
  // set either 'everything' as default time period, when no startDate is provided
  const toDate = !query.startDate ? undefined : query.endDate; ;
  const dateRange = [fromDate, toDate];
  const allExhibitionsAndEvents = await getAllOfType(['exhibitions', 'events'], {
    pageSize: 100,
    fetchLinks: eventFields,
    orderings: '[my.events.times.startDateTime desc, my.exhibitions.start]'
  });

  const exhibitionPromos = createExhibitionPromos(allExhibitionsAndEvents.results.filter(e => e.type === 'exhibitions'));
  const permanentExhibitionPromos = exhibitionPromos.filter(e => !e.end);
  const temporaryExhibitionPromos = filterPromosByDate(exhibitionPromos.filter(e => e.end), fromDate, toDate);
  const currentTemporaryExhibitionPromos = filterCurrentExhibitions(temporaryExhibitionPromos, todaysDate);
  const upcomingTemporaryExhibitionPromos = filterUpcomingExhibitions(temporaryExhibitionPromos, todaysDate);
  const eventPromos = filterPromosByDate(createEventPromos(allExhibitionsAndEvents.results.filter(e => e.type === 'events')), fromDate, toDate).sort((a, b) => a.start.localeCompare(b.start));

  // eventPromosSplitAcrossMonths and monthControls only required for the 'everything' view
  const eventPromosSplitAcrossMonths = duplicatePromosByMonthYear(eventPromos);
  const monthControls = Object.keys(eventPromosSplitAcrossMonths).reduce((acc, year) => {
    Object.keys(eventPromosSplitAcrossMonths[year]).forEach((month) => {
      const controlObject = {
        id: `${year}-${month}`,
        title: month,
        url: `#${month}-${year}`
      };
      acc.push(controlObject);
    });
    return acc;
  }, []);
  const dates = {
    today: todaysDate.format('YYYY-MM-DD'),
    weekend: [getWeekendFromDate(todaysDate).format('YYYY-MM-DD'), getWeekendToDate(todaysDate).format('YYYY-MM-DD')],
    all: [todaysDate.format('YYYY-MM-DD')],
    queriedDates: dateRange
  };
  const active = getActiveState(todaysDate, fromDate, toDate);
  const listHeader = getListHeader(dates, collectionOpeningTimes);
  return {
    active,
    dates,
    permanentExhibitionPromos,
    temporaryExhibitionPromos,
    currentTemporaryExhibitionPromos,
    upcomingTemporaryExhibitionPromos,
    eventPromos,
    eventPromosSplitAcrossMonths,
    monthControls,
    listHeader
  };
}

function getWeekendFromDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger !== 0) {
    return london(today).day(5);
  } else {
    return london(today).day(-2);
  }
}

function getWeekendToDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger === 0) {
    return london(today);
  } else {
    return london(today).day(7);
  }
}
