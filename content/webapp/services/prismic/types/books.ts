import * as prismic from '@prismicio/client';
import {
  CommonPrismicFields,
  FetchLinks,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
} from '.';

export type BookPrismicDocument = prismic.PrismicDocument<
  {
    subtitle: prismic.RichTextField;
    orderLink: prismic.LinkField;
    price: prismic.KeyTextField;
    format: prismic.KeyTextField;
    extent: prismic.KeyTextField;
    isbn: prismic.KeyTextField;
    reviews: prismic.GroupField<{
      text: prismic.RichTextField;
      citation: prismic.RichTextField;
    }>;
    datePublished: prismic.TimestampField;
  } & WithContributors &
    WithSeasons &
    WithExhibitionParents &
    CommonPrismicFields,
  'books'
>;

export const bookFetchLinks: FetchLinks<BookPrismicDocument> = ['books.title'];
