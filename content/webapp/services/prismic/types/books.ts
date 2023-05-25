import {
  GroupField,
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  KeyTextField,
} from '@prismicio/client';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';

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

export const bookFetchLinks: FetchLinks<BookPrismicDocument> = ['books.title'];
