import { Article as DeprecatedArticle } from '@weco/common/model/articles';
import { Override } from '@weco/common/utils/utility-types';
import { ArticlePrismicDocument } from '../services/prismic/types/articles';

export type Article = Override<
  DeprecatedArticle,
  {
    prismicDocument: ArticlePrismicDocument;
  }
>;
