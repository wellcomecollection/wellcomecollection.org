import {
  LinkField,
  RichTextField,
  TimestampField,
  PrismicDocument,
} from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import {
  CommonPrismicData,
  WithFormat,
  WithParents,
  WithSeasons,
  WithSeries,
} from './types';

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
  } & WithSeries &
    WithSeasons &
    WithFormat &
    WithParents &
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
