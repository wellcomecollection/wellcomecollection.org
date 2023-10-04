import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { transformGenericFields } from '.';
import { Season } from '../../../types/seasons';
import { SeasonPrismicDocument } from '../types/seasons';

export function transformSeason(document: SeasonPrismicDocument): Season {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const promo = genericFields.promo;
  return {
    type: 'seasons',
    start: transformTimestamp(data.start),
    end: transformTimestamp(data.end),
    datePublished: document.first_publication_date
      ? /* eslint-disable @typescript-eslint/no-explicit-any */
        transformTimestamp(document.first_publication_date as any)
      : /* eslint-enable @typescript-eslint/no-explicit-any */
        undefined,
    ...genericFields,
    labels: [{ text: 'Season' }],
    promo: promo && promo.image && promo,
  };
}
