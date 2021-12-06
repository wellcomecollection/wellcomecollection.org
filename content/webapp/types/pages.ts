import { Page as DeprecatedPage } from '@weco/common/model/pages';
import { Override } from '@weco/common/utils/utility-types';
import { PagePrismicDocument } from '../services/prismic/types/pages';

export type Page = Override<
  DeprecatedPage,
  {
    prismicDocument: PagePrismicDocument;
  }
>;
