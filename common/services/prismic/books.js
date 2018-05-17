// @flow
import type {PrismicDocument} from './types';
import type {Book} from '../../model/books';
import {getDocument} from './api';
import {
  parseTitle,
  parseImagePromo,
  parseTimestamp,
  asHtml
} from './parsers';

export function parseBookDoc(document: PrismicDocument): Book {
  const data = document.data;
  const promo = document.data.promo && parseImagePromo(document.data.promo);
  return {
    id: document.id,
    title: parseTitle(data.title),
    subtitle: data.subtitle && asHtml(data.subtitle),
    orderLink: data.orderLink && data.orderLink.url,
    price: data.price,
    format: data.format,
    extent: data.extent,
    isbn: data.isbn,
    reviews: data.reviews && data.reviews.map(review => {
      return {
        text: review.text && asHtml(review.text),
        citation: review.citation && asHtml(review.citation)
      };
    }),
    datePublished: data.datePublished && parseTimestamp(data.datePublished),
    authorName: data.authorName,
    authorImage: data.authorImage && data.authorImage.url,
    authorDescription: data.authorDescription && asHtml(data.authorDescription),
    promo,
    body: []
  };
}

export async function getBook(req: Request, id: string): Promise<?Book> {
  const document = await getDocument(req, id, {});

  if (document && document.type === 'books') {
    const book = parseBookDoc(document);
    return book;
  }
}
