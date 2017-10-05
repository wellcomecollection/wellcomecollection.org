import Prismic from 'prismic-javascript';
import {prismicApi, prismicPreviewApi} from './prismic-api';
import {parseArticleDoc, parseEventDoc, parseWebcomicDoc} from './prismic-parsers';

type DocumentType = 'articles' | 'webcomics' | 'events' | 'exhibitions';

const peopleFields = ['people.name', 'people.image', 'people.twitterHandle', 'people.description'];
const booksFields = ['books.title', 'books.title', 'books.author', 'books.isbn', 'books.publisher', 'books.link', 'books.cover'];
const seriesFields = ['series.name', 'series.description', 'series.color', 'series.schedule', 'series.commissionedLength'];
const contributorFields = ['editorial-contributor-roles.title', 'event-contributor-roles'];
const eventFields = [
  'event-access-options.title', 'event-access-options.acronym',
  'event-booking-enquiry-teams.title', 'event-booking-enquiry-teams.email', 'event-booking-enquiry-teams.phone',
  'event-formats.title', 'event-programmes.title'
];

async function getPrismicApi(req: ?Request) {
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
  const event = await getTypeById(previewReq, ['event'], id, {fetchLinks});

  if (!event) { return null; }

  return parseEventDoc(event);
}
