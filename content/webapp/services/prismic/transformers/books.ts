import { Book } from '../../../types/books';
import { BookPrismicDocument } from '../types/books';
import {
  transformGenericFields,
  transformKeyTextField,
  transformRichTextFieldToString,
} from '.';
import { isFilledLinkToWebField } from '../types';
import {
  asHtml,
  parsePromoToCaptionedImage,
  parseSingleLevelGroup,
  parseSeason,
  parseTimestamp,
} from '@weco/common/services/prismic/parsers';

export function transformBook(document: BookPrismicDocument): Book {
  const { data } = document;

  const genericFields = transformGenericFields(document);
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
    subtitle: transformRichTextFieldToString(data.subtitle),
    orderLink: isFilledLinkToWebField(data.orderLink)
      ? data.orderLink.url
      : undefined,
    price: transformKeyTextField(data.price),
    format: transformKeyTextField(data.format),
    extent: transformKeyTextField(data.extent),
    isbn: transformKeyTextField(data.isbn),
    reviews: data.reviews?.map(review => {
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
