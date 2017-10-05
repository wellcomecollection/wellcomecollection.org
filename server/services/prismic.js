import {prismicApi, prismicPreviewApi} from './prismic-api';
import {
  parseArticleDoc, parseEventDoc, parseExhibitionsDoc, parsePromoListItem,
  parseWebcomicDoc
} from './prismic-parsers';
import type {Promo} from '../model/promo';

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
  const event = await getTypeById(previewReq, ['events'], id, {fetchLinks});

  if (!event) { return null; }

  return parseEventDoc(event);
}

type ExhibitionContent = {|
  exhibition: Exhibition;
  galleryLevel: string;
  relatedBooks: Array<Promo>;
  relatedEvents: Array<Promo>;
  relatedGalleries: Array<Promo>;
  relatedArticles: Array<Promo>;
  imageGallery: any;
  textAndCaptionsDocument: any;
|}

export async function getExhibition(id: string, previewReq: ?Request): Promise<?ExhibitionContent> {
  const exhibition = await getTypeById(previewReq, ['exhibitions'], id, {});

  if (!exhibition) { return null; }

  const ex = parseExhibitionsDoc(exhibition);

  const promoList = exhibition.data.promoList;
  const relatedArticles = promoList.filter(x => x.type === 'article').map(parsePromoListItem);
  const relatedEvents = promoList.filter(x => x.type === 'event').map(parsePromoListItem);
  const relatedBooks = promoList.filter(x => x.type === 'book').map(parsePromoListItem);
  const relatedGalleries = promoList.filter(x => x.type === 'gallery').map(parsePromoListItem);

  const sizeInKb = Math.round(exhibition.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = Object.assign({}, exhibition.data.textAndCaptionsDocument, {sizeInKb});

  return {
    exhibition: ex,
    galleryLevel: '0',
    textAndCaptionsDocument: textAndCaptionsDocument.url && textAndCaptionsDocument,
    relatedBooks: relatedBooks,
    relatedEvents: relatedEvents,
    relatedGalleries: relatedGalleries,
    relatedArticles: relatedArticles
  };
}
