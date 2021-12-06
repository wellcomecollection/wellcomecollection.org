import { parseArticleSeries } from '@weco/common/services/prismic/article-series';
import { ArticleSeries as DeprecatedArticleSeries } from '@weco/common/model/article-series';
import { Series } from '../../../types/series';
import { SeriesPrismicDocument } from '../types/series';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformSeries(document: SeriesPrismicDocument): Series {
  const series: DeprecatedArticleSeries = parseArticleSeries(document);

  return {
    ...series,
    prismicDocument: document,
  };
}
