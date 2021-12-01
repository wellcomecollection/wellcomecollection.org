import {
  GroupField,
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  KeyTextField,
} from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import {
  CommonPrismicData,
  WithContributors,
  WithFormat,
  WithParents,
  WithSeasons,
  WithSeries,
} from './types';

const typeEnum = 'books';

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
    CommonPrismicData,
  'books'
>;

export async function getArticle(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<BookPrismicDocument | undefined> {
  const document = await client.getByID<BookPrismicDocument>(id);

  if (document.type === typeEnum) {
    return document;
  }
}
