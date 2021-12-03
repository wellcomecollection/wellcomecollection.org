import { parseArticleDoc } from '@weco/common/services/prismic/articles';
import { Article as DeprecatedArticle } from '@weco/common/model/articles';
import { Article } from '../../../model/articles';
import { ArticlePrismicDocument } from '../articles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformArticle(document: ArticlePrismicDocument): Article {
  const article: DeprecatedArticle = parseArticleDoc(document);

  return {
    ...article,
    prismicDocument: document,
  };
}
