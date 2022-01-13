// @flow
import {
  parseGenericFields,
  parseTimestamp,
  asHtml,
  asText,
  parsePromoToCaptionedImage,
  parseSingleLevelGroup,
} from './parsers';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
import type { Book } from '../../model/books';
import type { PrismicDocument } from './types';

export function parseBook(document: PrismicDocument): Book {
  const data = document.data;
  const genericFields = parseGenericFields(document);
  // We do this over the general parser as we want the not 16:9 image.
  const cover =
    data.promo &&
    (data.promo.length > 0
      ? parsePromoToCaptionedImage(data.promo, null)
      : null);
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });
  return {
    type: 'books',
    ...genericFields,
    subtitle: data.subtitle && asText(data.subtitle),
    orderLink: data.orderLink && data.orderLink.url,
    price: data.price,
    format: data.format,
    extent: data.extent,
    isbn: data.isbn,
    reviews:
      data.reviews &&
      data.reviews.map(review => {
        return {
          text: review.text && asHtml(review.text),
          citation: review.citation && asHtml(review.citation),
        };
      }),
    datePublished: data.datePublished && parseTimestamp(data.datePublished),
    cover: cover && cover.image,
    seasons,
    prismicDocument: document,
  };
}
