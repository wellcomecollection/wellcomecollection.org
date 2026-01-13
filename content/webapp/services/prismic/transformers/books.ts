import { BooksDocument as RawBooksDocument } from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { isFilledLinkToWebField } from '@weco/common/services/prismic/types';
import { Book, BookBasic } from '@weco/content/types/books';

import {
  asRichText,
  asText,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformContributors } from './contributors';
import { transformPromoToCaptionedImage } from './images';
import { transformSeasonsFromRelationshipGroup } from './seasons';

export function transformBookToBookBasic(book: Book): BookBasic {
  // returns what is required to render BookCards and book JSON-LD
  return (({ type, id, uid, title, subtitle, cover, promo, labels }) => ({
    type,
    id,
    uid,
    title,
    subtitle,
    cover,
    promo,
    labels,
  }))(book);
}

export function transformBook(document: RawBooksDocument): Book {
  const { data } = document;

  const genericFields = transformGenericFields(document);
  // We do this over the general parser as we want the not 16:9 image.
  const cover =
    data.promo &&
    (data.promo.length > 0
      ? transformPromoToCaptionedImage(data.promo)
      : undefined);
  const seasons = transformSeasonsFromRelationshipGroup(
    transformSingleLevelGroup(data.seasons, 'season')
  );
  const contributors = transformContributors(document);

  return {
    type: 'books',
    uid: document.uid,
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
