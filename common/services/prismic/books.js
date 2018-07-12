// @flow
import type {PrismicDocument} from './types';
import type {Book} from '../../model/books';
import {getDocument} from './api';
import {
  parseGenericFields,
  parseTimestamp,
  asHtml,
  checkAndParseImage,
  asText
} from './parsers';

export function parseBook(document: PrismicDocument): Book {
  const data = document.data;
  const genericFields = parseGenericFields(document);

  return {
    type: 'books',
    ...genericFields,
    subtitle: data.subtitle && asText(data.subtitle),
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
    authorName: data.authorName && asText(data.authorName),
    authorImage: data.authorImage && data.authorImage.url,
    authorDescription: data.authorDescription,
    cover: checkAndParseImage(data.cover)
  };
}

export async function getBook(req: Request, id: string): Promise<?Book> {
  const document = await getDocument(req, id, {});

  if (document && document.type === 'books') {
    const book = parseBook(document);
    return book;
  }
}
