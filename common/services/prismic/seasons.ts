import Prismic from 'prismic-javascript';
import { getPage } from '@weco/common/services/prismic/pages';
import { getArticles } from '@weco/common/services/prismic/articles';
import { getBooks } from '@weco/common/services/prismic/books';
import { getEvents } from '@weco/common/services/prismic/events';
import { getExhibitions } from '@weco/common/services/prismic/exhibitions';
import { SeasonWithContent } from '@weco/common/model/season';

export async function getSeasonWithContent(
  req: Request,
  { id }: { id: string },
  memoizedPrismic: Object | null
): Promise<SeasonWithContent | null> {
  const seasonPromise = await getPage(req, id, {}, memoizedPrismic);

  const articlesPromise = await getArticles(
    req,
    { predicates: [Prismic.Predicates.at('my.articles.season', id)] },
    memoizedPrismic
  );

  const booksPromise = await getBooks(
    req,
    { predicates: [Prismic.Predicates.at('my.books.season', id)] },
    memoizedPrismic
  );

  const eventsPromise = await getEvents(
    req,
    { predicates: [Prismic.Predicates.at('my.events.season', id)] },
    memoizedPrismic
  );

  const exhibitionsPromise = await getExhibitions(
    req,
    { predicates: [Prismic.Predicates.at('my.exhibitions.season', id)] },
    memoizedPrismic
  );

  const [season, articles, books, events, exhibitions] = await Promise.all([
    seasonPromise,
    articlesPromise,
    booksPromise,
    eventsPromise,
    exhibitionsPromise,
  ]);

  return {
    season,
    articles: articles?.results || null,
    books: books?.results || null,
    events: events?.results || null,
    exhibitions: exhibitions?.results || null,
  };
}
