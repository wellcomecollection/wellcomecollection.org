import { PrismicDocument } from './types';
import { Season } from '../../model/seasons';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseTimestamp,
} from './parsers';

export function parseSeason(document: PrismicDocument): Season {
  const data = document.data;
  const genericFields = parseGenericFields(document);
  const promo = genericFields.promo;
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });
  const start = parseTimestamp(data.start);
  const end = data.end && parseTimestamp(data.end);
  return {
    type: 'seasons',
    start,
    end,
    ...genericFields,
    seasons,
    labels: [{ text: 'Season' }],
    promo: promo && promo.image && promo,
    prismicDocument: document,
  };
}
