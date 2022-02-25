import { ArticleSeries as SeriesDeprecated } from '@weco/common/model/article-series';
import { Override } from '@weco/common/utils/utility-types';
import { Article } from './articles';
import { Contributor } from './contributors';

export type Series = Override<
  SeriesDeprecated,
  {
    items: Article[];
    contributors: Contributor[];
  }
>;
