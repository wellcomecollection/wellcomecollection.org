// Annoyingly this file and type is called series, but it is only used for articles
import {
  GroupField,
  RelationField,
  RichTextField,
  TimestampField,
  PrismicDocument,
  SelectField,
} from '@prismicio/types';
import { CommonPrismicData } from './types';

export type SeriesPrismicDocument = PrismicDocument<
  {
    color: SelectField<'teal' | 'red' | 'green' | 'purple'>;
    schedule: GroupField<{
      title: RichTextField;
      publishDate: TimestampField;
    }>;
    contributors: GroupField<{
      contributor: RelationField<'people', 'organisation'>;
      role: RelationField<'editorial-contributor-roles'>;
      description: RichTextField;
    }>;
    seasons: GroupField<{
      season: RelationField<'seasons'>;
    }>;
  } & CommonPrismicData,
  'series'
>;
