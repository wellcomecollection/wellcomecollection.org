import { parsePage } from '@weco/common/services/prismic/pages';
import { Page as DeprecatedPage } from '@weco/common/model/pages';
import { Page } from '../../../types/pages';
import { PagePrismicDocument } from '../types/pages';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformPage(document: PagePrismicDocument): Page {
  const page: DeprecatedPage = parsePage(document);

  return {
    ...page,
    prismicDocument: document,
  };
}
