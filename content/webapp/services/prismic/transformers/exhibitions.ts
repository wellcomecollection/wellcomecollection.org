import { parseExhibitions } from '@weco/common/services/prismic/exhibitions';
import { Exhibition as DeprecatedExhibition } from '@weco/common/model/exhibitions';
import { Exhibition } from '../../../types/exhibitions';
import { ExhibitionPrismicDocument } from '../types/exhibitions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformExhibition(
  document: ExhibitionPrismicDocument
): Exhibition {
  const exhibition: DeprecatedExhibition = parseExhibitions(document);

  return {
    ...exhibition,
    prismicDocument: document,
  };
}
