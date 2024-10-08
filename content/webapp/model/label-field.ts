import * as prismic from '@prismicio/client';

import { ArticleFormatId } from '@weco/content/data/content-format-ids';

export type LabelField = {
  id?: ArticleFormatId;
  title?: string;
  description?: prismic.RichTextField;
};
