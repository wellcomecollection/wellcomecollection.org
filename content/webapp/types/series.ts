import { ArticleSeries as SeriesDeprecated } from '@weco/common/model/article-series';
import { Override } from '@weco/common/utils/utility-types';
import { SeriesPrismicDocument } from '../services/prismic/types/series';

export type Series = Override<
  SeriesDeprecated,
  {
    prismicDocument: SeriesPrismicDocument;
  }
>;
