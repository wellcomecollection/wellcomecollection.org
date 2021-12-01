import {
  TimestampField,
  PrismicDocument,
  RelationField,
  RichTextField,
  BooleanField,
} from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import {
  CommonPrismicData,
  InferDataInterface,
  WithContributors,
  WithParents,
  WithSeasons,
} from './types';

const typeEnum = 'events';

type PageFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'page-formats'
>;

export type EventPrismicDocument = PrismicDocument<
  {
    format: RelationField<
      'page-formats',
      'en-gb',
      InferDataInterface<PageFormat>
    >;
    datePublished: TimestampField;
    isOnline: BooleanField;
    availableOnline: BooleanField;
    showOnThisPage: BooleanField;
  } & WithContributors &
    WithParents &
    WithSeasons &
    CommonPrismicData,
  typeof typeEnum
>;

export async function getExhibition(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<EventPrismicDocument | undefined> {
  const document = await client.getByID<EventPrismicDocument>(id);

  if (document.type === typeEnum) {
    return document;
  }
}
