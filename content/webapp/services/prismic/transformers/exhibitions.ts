import { parseExhibitions } from '@weco/common/services/prismic/exhibitions';
import { Exhibition as DeprecatedExhibition } from '@weco/common/model/exhibitions';
import { Exhibition } from '../../../model/exhibitions';
import { ExhibitionPrismicDocument } from '../exhibitions';

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
