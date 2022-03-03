import { HTMLString } from '@weco/common/services/prismic/types';
import { ArticleFormatId } from '@weco/common/services/prismic/content-format-ids';

export type LabelField = {
  id?: ArticleFormatId;
  title?: string;
  description?: HTMLString;
};
