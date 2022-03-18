import {
  GroupField,
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  KeyTextField,
  RelationField,
} from '@prismicio/types';
import {
  CommonPrismicFields,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
  contributorFetchLinks,
  commonPrismicFieldsFetchLinks,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';

export type FeaturedBooksPrismicDocument = PrismicDocument<{
  books: GroupField<{
    book: RelationField<
      'book',
      'en-us',
      InferDataInterface<Partial<BookPrismicDocument>>
    >;
  }>;
}>;

export type BookPrismicDocument = PrismicDocument<
  {
    subtitle: RichTextField;
    orderLink: LinkField;
    price: KeyTextField;
    format: KeyTextField;
    extent: KeyTextField;
    isbn: KeyTextField;
    reviews: GroupField<{
      text: RichTextField;
      citation: RichTextField;
    }>;
    datePublished: TimestampField;
  } & WithContributors &
    WithSeasons &
    WithExhibitionParents &
    CommonPrismicFields,
  'books'
>;

export const booksFetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
];
