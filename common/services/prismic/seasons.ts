import Prismic from 'prismic-javascript';
import { getPage } from '@weco/common/services/prismic/pages';
import { getArticles } from '@weco/common/services/prismic/articles';
import { getBooks } from '@weco/common/services/prismic/books';
import { getEvents } from '@weco/common/services/prismic/events';
import { getExhibitions } from '@weco/common/services/prismic/exhibitions';
import { SeasonWithContent } from '@weco/common/model/season';
import { IncomingMessage } from 'http';

export async function getSeasonWithContent({
  request,
  id,
  memoizedPrismic,
}: {
  request: IncomingMessage;
  id: string | string[];
  memoizedPrismic: string | string[] | null;
}): Promise<SeasonWithContent | null> {
  const seasonPromise = await getPage(request, id, memoizedPrismic);

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

  const [season, articles, books, events, exhibitions] = await Promise.all([
    seasonPromise,
    articlesPromise,
    booksPromise,
    eventsPromise,
    exhibitionsPromise,
  ]);
  console.log(events);
  return {
    season,
    articles: articles?.results || [],
    books: books?.results || [],
    events: events?.results || [],
    exhibitions: exhibitions?.results || [],
  };
}
