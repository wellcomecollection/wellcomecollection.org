import { Book } from '../../../types/books';
import { BookPrismicDocument } from '../types/books';
import {
  transformGenericFields,
  transformKeyTextField,
  asRichText,
  transformRichTextFieldToString,
  transformTimestamp,
  transformSingleLevelGroup,
} from '.';
import { isFilledLinkToWebField } from '../types';
import { transformSeason } from './seasons';
import { transformPromoToCaptionedImage } from './images';
import { SeasonPrismicDocument } from '../types/seasons';

export function transformBook(document: BookPrismicDocument): Book {
  const { data } = document;

  const genericFields = transformGenericFields(document);
  // We do this over the general parser as we want the not 16:9 image.
  const cover =
    data.promo &&
    (data.promo.length > 0 ? transformPromoToCaptionedImage(data.promo) : undefined);
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as SeasonPrismicDocument)
  );

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
        text: review.text && asRichText(review.text) || [],
        citation: review.citation && asRichText(review.citation) || [],
      };
    }),
    datePublished: data.datePublished ? transformTimestamp(data.datePublished) : undefined,
    cover: cover && cover.image,
    seasons,
    prismicDocument: document,
  };
}
