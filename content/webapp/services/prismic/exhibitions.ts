import {
  GroupField,
  TimestampField,
  NumberField,
  PrismicDocument,
  RelationField,
  RichTextField,
  SelectField,
} from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import { CommonPrismicData, InferDataInterface } from './types';

const typeEnum = 'exhibitions';

type ExhibitionFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'exhibition-formats'
>;

export type ExhibitionPrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'exhibition-formats',
      'en-gb',
      InferDataInterface<ExhibitionFormat>
    >;
    shortTitle: RichTextField;
    start: TimestampField;
    end: TimestampField;
    isPermanent: SelectField<'yes'>;
    statusOverride: RichTextField;
    place: RelationField<'place'>;
    contributorsTitle: RichTextField;
    contributors: GroupField<{
      contributor: RelationField<'people', 'organisation'>;
      role: RelationField<'editorial-contributor-roles'>;
      description: RichTextField;
    }>;
    exhibits: GroupField<{
      item: RelationField<'exhibitions'>;
    }>;
    events: GroupField<{
      item: RelationField<'events'>;
    }>;
    articles: GroupField<{
      item: RelationField<'articles'>;
    }>;
    resources: GroupField<{
      item: RelationField<'resources'>;
    }>;
    seasons: GroupField<{
      season: RelationField<'seasons'>;
    }>;
    parents: GroupField<{
      parent: RelationField<'exhibitions'>;
      order: NumberField;
    }>;
  } & CommonPrismicData,
  typeof typeEnum
>;

export async function getExhibition(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<ExhibitionPrismicDocument | undefined> {
  const document = await client.getByID<ExhibitionPrismicDocument>(id);

  if (document.type === typeEnum) {
    return document;
  }
}
