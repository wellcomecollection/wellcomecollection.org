import { parsePage } from '@weco/common/services/prismic/pages';
import { Guide as DeprecatedGuide } from '@weco/common/model/guides';
import { Guide } from '../../../types/guides';
import { GuidePrismicDocument } from '../types/guides';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformGuide(document: GuidePrismicDocument): Guide {
  const guide: DeprecatedGuide = parsePage(document);

  return {
    ...guide,
    prismicDocument: document,
  };
}
