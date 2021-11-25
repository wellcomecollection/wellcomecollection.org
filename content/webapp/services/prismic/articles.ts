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
import { CommonPrismicData, InferDataInterface } from './types';

const typeEnum = 'articles';

type ArticleFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'exhibition-formats'
>;

export type ArticlePrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'article-formats',
      'en-gb',
      InferDataInterface<ArticleFormat>
    >;
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
    series: GroupField<{ series: RelationField<'series'> }>;
    seasons: GroupField<{ season: RelationField<'seasons'> }>;
    parents: GroupField<{
      order: NumberField;
      parent: RelationField<'exhibitions'>;
    }>;
  } & CommonPrismicData,
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
