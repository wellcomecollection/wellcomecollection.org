import { transformGenericFields, transformTimestamp } from '.';
import { Season } from '../../../types/seasons';
import { SeasonPrismicDocument } from '../types/seasons';

export function transformSeason(document: SeasonPrismicDocument): Season {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const promo = genericFields.promo;
  const start = transformTimestamp(data.start)!;
  const end = data.end ? transformTimestamp(data.end) : undefined;
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
