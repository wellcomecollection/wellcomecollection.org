import * as prismicT from '@prismicio/types';
import { ArticleFormatId } from '@weco/common/data/content-format-ids';

export type LabelField = {
  id?: ArticleFormatId;
  title?: string;
  description?: prismicT.RichTextField;
};
