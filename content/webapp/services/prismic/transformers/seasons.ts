import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { london } from '@weco/common/utils/format-date';
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
      ? london(document.first_publication_date).toDate()
      : undefined,
    ...genericFields,
    labels: [{ text: 'Season' }],
    promo: promo && promo.image && promo,
  };
}
