import Prismic from 'prismic-javascript';
import { PrismicDocument } from './types';
import { getDocument } from './api';
import { getArticles } from './articles';
import { getBooks } from './books';
import { getEvents } from './events';
import { getExhibitions } from './exhibitions';
import { getPages } from './pages';
import { Season, SeasonWithContent } from '../../model/seasons';
import { parseGenericFields } from './parsers';
import {
  pagesFields,
  articlesFields,
  bookFields,
  eventsFields,
  exhibitionFields,
} from './fetch-links';
import { IncomingMessage } from 'http';

export function parseSeason(document: PrismicDocument): Season {
  const genericFields = parseGenericFields(document);
  const promo = genericFields.promo;

  return {
    type: 'seasons',
    ...genericFields,
    labels: [{ url: null, text: 'Season' }],
    promo: promo && promo.image && promo,
  };
}

export async function getSeason(
  req: IncomingMessage | undefined,
  id: string,
  memoizedPrismic: Record<string, unknown>
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
  const seasonPromise = await getSeason(request, id, memoizedPrismic);

  const articlesPromise = await getArticles(
    request,
    { predicates: [Prismic.Predicates.at('my.articles.seasons.season', id)] },
    memoizedPrismic
  );

  const booksPromise = await getBooks(
    request,
    { predicates: [Prismic.Predicates.at('my.books.seasons.season', id)] },
    memoizedPrismic
  );

  const eventsPromise = await getEvents(
    request,
    { predicates: [Prismic.Predicates.at('my.events.seasons.season', id)] },
    memoizedPrismic
  );

  const exhibitionsPromise = await getExhibitions(
    request,
    {
      predicates: [Prismic.Predicates.at('my.exhibitions.seasons.season', id)],
    },
    memoizedPrismic
  );

  const pagesPromise = await getPages(
    request,
    {
      predicates: [Prismic.Predicates.at('my.pages.seasons.season', id)],
    },
    memoizedPrismic
  );

  const [season, articles, books, events, exhibitions, pages] = await Promise.all([
    seasonPromise,
    articlesPromise,
    booksPromise,
    eventsPromise,
    exhibitionsPromise,
    pagesPromise,
  ]);

  if (season) {
    return {
      season,
      articles: articles?.results || [],
      books: books?.results || [],
      events: events?.results || [],
      exhibitions: exhibitions?.results || [],
      pages: pages?.results || [],
    };
  }
}
