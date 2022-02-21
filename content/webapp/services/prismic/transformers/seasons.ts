import { transformGenericFields } from '.';
import { Season } from '../../../types/seasons';
import { SeasonPrismicDocument } from '../types/seasons';
import { parseTimestamp } from '@weco/common/services/prismic/parsers';

export function transformSeason(document: SeasonPrismicDocument): Season {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const promo = genericFields.promo;
  const start = parseTimestamp(data.start);
  const end = data.end && parseTimestamp(data.end);
  return {
    type: 'seasons',
    start,
    end,
    ...genericFields,
    labels: [{ text: 'Season' }],
    promo: promo && promo.image && promo,
    prismicDocument: document,
  };
}
