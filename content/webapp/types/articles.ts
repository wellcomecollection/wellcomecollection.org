import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';

import { ColorSelection } from './color-selections';
import { Contributor } from './contributors';
import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { ImagePromo } from './image-promo';
import { Season } from './seasons';
import { Series, SeriesBasic } from './series';

export type ArticleBasic = {
  // this is a mix of props from GenericContentFields and Article
  // and is only what is required to render ArticlePromos and json-ld
  type: 'articles';
  uid: string;
  id: string;
  promo?: ImagePromo | undefined;
  series: SeriesBasic[];
  title: string;
  format?: Format<ArticleFormatId>;
  image?: ImageType;
  datePublished: Date;
  labels: Label[];
  color?: ColorSelection;
};

export type Article = GenericContentFields & {
  type: 'articles';
  uid: string;
  format?: Format<ArticleFormatId>;
  readingTime?: string;
  datePublished: Date;
  series: Series[];
  seasons: Season[];
  color?: ColorSelection;
  contributors: Contributor[];
  exploreMoreDocument?: {
    id: string;
    uid?: string;
    type: 'articles' | 'exhibitions';
  };
  // TODO: remove before merge as we want to load this client side... do we??
  linkedWorks: ContentApiLinkedWork[];
};

/** Given an article in a serial, return its part number.
 *
 * e.g. "Cataloguing Audrey" is the second article in the "Finding Audrey Amiss" serial,
 * so it has a part number of 2.
 */
export function getPartNumberInSeries(
  article: ArticleBasic
): number | undefined {
  return article.series
    .flatMap(series => series.schedule)
    .find(scheduleItem => scheduleItem.title === article.title)?.partNumber;
}

export function getArticleColor(article: ArticleBasic): ColorSelection {
  return (
    article.series.map(series => series.color).find(Boolean) || 'accent.purple'
  );
}
