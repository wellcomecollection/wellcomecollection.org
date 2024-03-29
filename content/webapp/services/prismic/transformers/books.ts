import { Book, BookBasic } from '../../../types/books';
import { BookPrismicDocument } from '../types/books';
import {
  transformGenericFields,
  asRichText,
  asText,
  transformSingleLevelGroup,
} from '.';
import { isFilledLinkToWebField } from '@weco/common/services/prismic/types';
import { transformSeason } from './seasons';
import { transformPromoToCaptionedImage } from './images';
import { SeasonPrismicDocument } from '../types/seasons';
import { transformContributors } from './contributors';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';

export function transformBookToBookBasic(book: Book): BookBasic {
  // returns what is required to render BookPromos and book JSON-LD
  return (({ type, id, title, subtitle, cover, promo, labels }) => ({
    type,
    id,
    title,
    subtitle,
    cover,
    promo,
    labels,
  }))(book);
}

export function transformBook(document: BookPrismicDocument): Book {
  const { data } = document;

  const genericFields = transformGenericFields(document);
  // We do this over the general parser as we want the not 16:9 image.
  const cover =
    data.promo &&
    (data.promo.length > 0
      ? transformPromoToCaptionedImage(data.promo)
      : undefined);
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as SeasonPrismicDocument)
  );
  const contributors = transformContributors(document);

  return {
    type: 'books',
    ...genericFields,
    subtitle: asText(data.subtitle),
    orderLink: isFilledLinkToWebField(data.orderLink)
      ? data.orderLink.url
      : undefined,
    price: asText(data.price),
    format: asText(data.format),
    extent: asText(data.extent),
    isbn: asText(data.isbn),
    reviews: data.reviews?.map(review => {
      return {
        text: (review.text && asRichText(review.text)) || [],
        citation: (review.citation && asRichText(review.citation)) || [],
      };
    }),
    datePublished: data.datePublished
      ? transformTimestamp(data.datePublished)
      : undefined,
    cover: cover && cover.image,
    seasons,
    contributors,
  };
}
