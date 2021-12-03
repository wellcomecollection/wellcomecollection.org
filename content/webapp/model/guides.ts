import { Guide as DeprecatedGuide } from '@weco/common/model/guides';
import { Override } from '@weco/common/utils/utility-types';
import { GuidePrismicDocument } from '../services/prismic/guides';

export type Guide = Override<
  DeprecatedGuide,
  {
    prismicDocument: GuidePrismicDocument;
  }
>;
