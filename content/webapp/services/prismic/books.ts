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
  WithFormat,
  WithParents,
  WithSeasons,
  WithSeries,
} from './types';

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
  } & WithSeries &
    WithFormat &
    WithContributors &
    WithSeasons &
    WithParents &
    CommonPrismicFields,
  'books'
>;
