import { parsePage } from '@weco/common/services/prismic/pages';
import { Guide as DeprecatedGuide } from '@weco/common/model/guides';
import { Format as DeprecatedFormat } from '@weco/common/model/format';
import { Guide, GuideFormat } from '../../../types/guides';
import {
  GuidePrismicDocument,
  GuideFormatPrismicDocument,
} from '../types/guides';
import { parseFormat } from '@weco/common/services/prismic/parsers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformGuide(document: GuidePrismicDocument): Guide {
  const guide: DeprecatedGuide = parsePage(document);

  return {
    ...guide,
    prismicDocument: document,
  };
}

export function transformGuideFormat(
  document: GuideFormatPrismicDocument
): GuideFormat {
  const format: DeprecatedFormat = parseFormat(document);

  return {
    ...format,
    prismicDocument: document,
  };
}
