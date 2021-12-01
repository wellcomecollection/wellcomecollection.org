import {
  GroupField,
  LinkField,
  NumberField,
  RelationField,
  RichTextField,
  TimestampField,
  PrismicDocument,
} from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import { CommonPrismicData, WithFormat, WithSeries } from './types';

const typeEnum = 'articles';

export type ArticlePrismicDocument = PrismicDocument<
  {
    publishDate: TimestampField;
    outroResearchItem: LinkField;
    outroResearchLinkText: RichTextField;
    outroReadItem: LinkField;
    outroReadLinkText: RichTextField;
    outroVisitItem: LinkField;
    outroVisitLinkText: RichTextField;
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
  'articles'
>;

export async function getArticle(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<ArticlePrismicDocument | undefined> {
  const document = await client.getByID<ArticlePrismicDocument>(id);

  if (document.type === typeEnum) {
    return document;
  }
}
