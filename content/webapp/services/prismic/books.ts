import {
  GroupField,
  LinkField,
  NumberField,
  RelationField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  KeyTextField,
} from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import { CommonPrismicData, WithFormat, WithSeries } from './types';

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
    contributors: GroupField<{
      role: RelationField<'editorial-contributor-roles'>;
      contributor: RelationField<'people' | 'organisations'>;
      description: RichTextField;
    }>;
    seasons: GroupField<{ season: RelationField<'seasons'> }>;
    parents: GroupField<{
      order: NumberField;
      parent: RelationField<'exhibitions'>;
    }>;
  } & WithSeries &
    WithFormat &
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
