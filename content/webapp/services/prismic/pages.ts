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

const typeEnum = 'pages';

type PageFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'page-formats'
>;

export type PagesPrismicDocument = PrismicDocument<
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
): Promise<PagesPrismicDocument | undefined> {
  const document = await client.getByID<PagesPrismicDocument>(id);

  if (document.type === typeEnum) {
    return document;
  }
}
