import { PrismicDocument } from './types';
import { getDocument } from './api';
import { Season, SeasonWithContent } from '../../model/seasons';
import {
  parseGenericFields,
  parseSingleLevelGroup,
  parseTimestamp,
} from './parsers';
import { IncomingMessage } from 'http';

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

export async function getSeason(
  req: IncomingMessage | undefined,
  id: string,
  memoizedPrismic?: Record<string, unknown>
): Promise<Season | undefined> {
  const season = await getDocument(req, id, {}, memoizedPrismic);

  if (season) {
    return parseSeason(season);
  }
}

export async function getSeasonWithContent({
  request,
  id,
  memoizedPrismic,
}: {
  request: IncomingMessage | undefined;
  memoizedPrismic: Record<string, unknown>;
  id: string;
}): Promise<SeasonWithContent | undefined> {
  const seasonPromise = getSeason(request, id, memoizedPrismic);

  const [season] = await Promise.all([seasonPromise]);
  if (season) {
    return {
      season,
    };
  }
}
