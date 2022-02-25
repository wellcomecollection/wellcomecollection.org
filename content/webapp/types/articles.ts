import { Article as DeprecatedArticle } from '@weco/common/model/articles';
import { Override } from '@weco/common/utils/utility-types';
import { ArticlePrismicDocument } from '../services/prismic/types/articles';
import { Contributor } from './contributors';
import { Series } from './series';

export type Article = Override<
  DeprecatedArticle,
  {
    series: Series[];
    contributors: Contributor[];
    prismicDocument: ArticlePrismicDocument;
  }
>;
