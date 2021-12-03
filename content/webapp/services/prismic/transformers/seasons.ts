import { parseSeason } from '@weco/common/services/prismic/seasons';
import { Season } from '../../../model/seasons';
import { SeasonPrismicDocument } from '../seasons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformGuide(document: SeasonPrismicDocument): Season {
  const season = parseSeason(document as any);

  return {
    ...season,
    prismicDocument: document,
  };
}
