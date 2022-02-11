import { Guide as DeprecatedGuide } from '@weco/common/model/guides';
import { Format as DeprecatedFormat } from '@weco/common/model/format';
import { Override } from '@weco/common/utils/utility-types';
import {
  GuidePrismicDocument,
  GuideFormatPrismicDocument,
} from '../services/prismic/types/guides';

export type GuideFormat = Override<
  DeprecatedFormat,
  {
    prismicDocument: GuideFormatPrismicDocument;
  }
>;

export type Guide = Override<
  DeprecatedGuide,
  {
    prismicDocument: GuidePrismicDocument;
  }
>;
