import Prismic from 'prismic-javascript';
import { getPage } from '@weco/common/services/prismic/pages';
import { getArticles } from '@weco/common/services/prismic/articles';
import { getBooks } from '@weco/common/services/prismic/books';
import { getEvents } from '@weco/common/services/prismic/events';
import { getExhibitions } from '@weco/common/services/prismic/exhibitions';

// TODO typing
export async function getSeasonWithContent(
  req,
  { id, ...opts },
  memoizedPrismic
) {
  const seasonPromise = await getPage(
    // TODO getSeason with parsing
    req,
    id,
    {
      // fetchLinks: peopleFields.concat(
      //   exhibitionFields,
      //   organisationsFields,
      //   contributorsFields,
      //   placesFields,
      //   exhibitionResourcesFields,
      //   eventSeriesFields,
      //   articlesFields,
      //   eventsFields
      // ),
    },
    memoizedPrismic
  );

  // const articlesPromise = await getArticles(
  //   req,
  //   { predicates: [Prismic.Predicates.at('my.articles.season', id)] },
  //   memoizedPrismic
  // );

  const booksPromise = await getBooks(
    req,
    { predicates: [Prismic.Predicates.at('my.books.season', id)] },
    memoizedPrismic
  );

  // const eventsPromise = await getEvents(
  //   req,
  //   { predicates: [Prismic.Predicates.at('my.events.season', id)] },
  //   memoizedPrismic
  // );
  // const exhibitionsPromise = await getExhibitions(
  //   req,
  //   { predicates: [Prismic.Predicates.at('my.events.season', id)] },
  //   memoizedPrismic
  // );

  // const peoplePromise = await getDocuments(
  //   // TODO getPeople, with parsing
  //   req,
  //   [Prismic.Predicates.at('my.people.season', id)],
  //   {
  //     ...opts,
  //   },
  //   memoizedPrismic
  // );

  // const [season, articles, books, events, exhibitions] = await Promise.all([
  const [season, books] = await Promise.all([
    seasonPromise,
    // articlesPromise,
    booksPromise,
    // eventsPromise,
    // exhibitionsPromise,
    // peoplePromise,
  ]);

  return {
    season,
    // articles: articles?.results,
    books: books?.results,
    // events: events?.results,
    // exhibitions: exhibitions?.results,
    // people: people?.results,
  };
}
