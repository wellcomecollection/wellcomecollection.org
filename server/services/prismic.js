import Prismic from 'prismic-javascript';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import {parseArticleDoc, parseWebcomicDoc} from './prismic-parsers';


async function getPrismicApi(req: ?Request) {
  return req ? await prismicPreviewApi(req) : await prismicApi();
}

export async function getArticle(id: string, previewReq: ?Request) {
  const prismic = await getPrismicApi(previewReq);
  const fetchLinks = [
    'people.name', 'people.image', 'people.twitterHandle', 'people.description',
    'books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover',
    'series.name', 'series.description', 'series.color', 'series.schedule', 'series.commissionedLength',
    'editorial-contributor-roles.title', 'event-contributor-roles'
  ];

  const articles = await prismic.query([
    Prismic.Predicates.at('document.id', id),
    Prismic.Predicates.any('document.type', ['articles', 'webcomics'])
  ], {fetchLinks});
  const prismicDoc = articles.total_results_size === 1 ? articles.results[0] : null;

  if (!prismicDoc) {
    return null;
  }

  switch (prismicDoc.type) {
    case 'articles': return parseArticleDoc(prismicDoc);
    case 'webcomics': return parseWebcomicDoc(prismicDoc);
  }
}
