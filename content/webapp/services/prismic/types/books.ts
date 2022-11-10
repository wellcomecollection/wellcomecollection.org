import {
  GroupField,
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  KeyTextField,
} from '@prismicio/types';
import {
  CommonPrismicFields,
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
