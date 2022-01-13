import { parseSeason } from '@weco/common/services/prismic/seasons';
import { Season } from '../../../types/seasons';
import { SeasonPrismicDocument } from '../types/seasons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformSeason(document: SeasonPrismicDocument): Season {
  const season = parseSeason(document as any);

  return {
    ...season,
    prismicDocument: document,
  };
}
