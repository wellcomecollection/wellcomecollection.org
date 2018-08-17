// @flow
import type {PrismicDocument} from './types';
import type {Book} from '../../model/books';
import {getDocument} from './api';
import {
  parseGenericFields,
  parseTimestamp,
  asHtml,
  asText,
  parsePromoToCaptionedImage
} from './parsers';
import {
  contributorsFields,
  peopleFields,
  organisationsFields
} from './fetch-links';

export function parseBook(document: PrismicDocument): Book {
  const data = document.data;
  const genericFields = parseGenericFields(document);
  // We do this over the general parser as we want the not 16:9 image.
  const cover = data.promo && (data.promo.length > 0 ? parsePromoToCaptionedImage(data.promo, null) : null);
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
    cover: cover && cover.image
  };
}

export async function getBook(req: Request, id: string): Promise<?Book> {
  const document = await getDocument(req, id, {
    fetchLinks: contributorsFields.concat(peopleFields, organisationsFields)
  });

  if (document && document.type === 'books') {
    const book = parseBook(document);
    return book;
  }
}
