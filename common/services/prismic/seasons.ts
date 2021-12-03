import Prismic from '@prismicio/client';
import { PrismicDocument } from './types';
import { getDocument } from './api';
import { getArticles } from './articles';
import { getBooks } from './books';
import { getEvents } from './events';
import { getExhibitions } from './exhibitions';
import { getPages } from './pages';
import { getProjects } from './projects';
import { getMultipleArticleSeries } from './article-series';
import { Season, SeasonWithContent } from '../../model/seasons';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseTimestamp,
} from './parsers';
import {
  pagesFields,
  articlesFields,
  bookFields,
  eventsFields,
  exhibitionFields,
} from './fetch-links';
import { IncomingMessage } from 'http';

export function parseSeason(document: PrismicDocument): Season {
  const data = document.data;
  const genericFields = parseGenericFields(document);
  const promo = genericFields.promo;
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });
  const start = parseTimestamp(data.start);
  const end = data.end && parseTimestamp(data.end);
  return {
    type: 'seasons',
    start,
    end,
    ...genericFields,
    seasons,
    labels: [{ text: 'Season' }],
    promo: promo && promo.image && promo,
  };
}

export async function getSeason(
  req: IncomingMessage | undefined,
  id: string,
  memoizedPrismic?: Record<string, unknown>
): Promise<Season | undefined> {
  const season = await getDocument(
    req,
    id,
    {
      fetchLinks: pagesFields.concat(
        articlesFields,
        bookFields,
        eventsFields,
        exhibitionFields
      ),
    },
    memoizedPrismic
  );

  if (season) {
    return parseSeason(season);
  }
}

export async function getSeasonWithContent({
  request,
  id,
  memoizedPrismic,
}: {
  request: IncomingMessage | undefined;
  memoizedPrismic: Record<string, unknown>;
  id: string;
}): Promise<SeasonWithContent | undefined> {
  const seasonPromise = getSeason(request, id, memoizedPrismic);

  const articlesPromise = getArticles(
    request,
    { predicates: [Prismic.Predicates.at('my.articles.seasons.season', id)] },
    memoizedPrismic
  );

  const booksPromise = getBooks(
    request,
    { predicates: [Prismic.Predicates.at('my.books.seasons.season', id)] },
    memoizedPrismic
  );

  const eventsPromise = getEvents(
    request,
    { predicates: [Prismic.Predicates.at('my.events.seasons.season', id)] },
    memoizedPrismic
  );

  const exhibitionsPromise = getExhibitions(
    request,
    {
      predicates: [Prismic.Predicates.at('my.exhibitions.seasons.season', id)],
    },
    memoizedPrismic
  );

  const pagesPromise = getPages(
    request,
    {
      predicates: [Prismic.Predicates.at('my.pages.seasons.season', id)],
    },
    memoizedPrismic
  );

  const articleSeriesPromise = getMultipleArticleSeries(
    request,
    {
      predicates: [Prismic.Predicates.at('my.series.seasons.season', id)],
    },
    memoizedPrismic
  );

  const projectsPromise = getProjects(
    request,
    {
      predicates: [Prismic.Predicates.at('my.projects.seasons.season', id)],
    },
    memoizedPrismic
  );

  const [
    season,
    articles,
    books,
    events,
    exhibitions,
    pages,
    articleSeries,
    projects,
  ] = await Promise.all([
    seasonPromise,
    articlesPromise,
    booksPromise,
    eventsPromise,
    exhibitionsPromise,
    pagesPromise,
    articleSeriesPromise,
    projectsPromise,
  ]);

  if (season) {
    return {
      season,
      articles: articles?.results || [],
      books: books?.results || [],
      events: events?.results || [],
      exhibitions: exhibitions?.results || [],
      pages: pages?.results || [],
      articleSeries: articleSeries?.results || [],
      projects: projects?.results || [],
    };
  }
}
