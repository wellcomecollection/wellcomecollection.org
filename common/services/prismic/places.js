// @flow
import type { PrismicDocument } from './types';
import { getDocument } from './api';
import { parseNumber, parseGenericFields } from './parsers';
import type { Place } from '../../model/places';

function parsePlaceDoc(document: PrismicDocument): Place {
  const data = document.data;
  const genericFields = parseGenericFields(document);
  const labels = [{ text: 'Place' }];

  return {
    ...genericFields,
    labels,
    level: data.level && parseNumber(data.level),
    capacity: data.capacity && parseNumber(data.capacity),
    information: data.locationInformation,
  };
}

export async function getPlace(
  req: ?Request,
  id: string,
  memoizedPrismic: ?Object
): Promise<?Place> {
  const document = await getDocument(req, id, {}, memoizedPrismic);

  if (document && document.type === 'places') {
    const place = parsePlaceDoc(document);
    return place;
  }
}
