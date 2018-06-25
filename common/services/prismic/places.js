// @flow
import type {PrismicDocument} from './types';
import {getDocument} from './api';
import {
  parseTitle,
  parseImagePromo,
  parseBody,
  parseNumber
} from './parsers';
import type {Place} from '../../model/places';

export function parsePlaceDoc(document: PrismicDocument): Place {
  const data = document.data;
  const promo = document.data.promo && parseImagePromo(document.data.promo);
  return {
    id: document.id,
    title: parseTitle(data.title),
    level: data.level && parseNumber(data.level),
    capacity: data.capacity && parseNumber(data.capacity),
    promo: promo,
    body: data.body ? parseBody(data.body) : []
  };
}

export async function getPlace(req: Request, id: string): Promise<?Place> {
  const document = await getDocument(req, id, {});

  if (document && document.type === 'places') {
    const place = parsePlaceDoc(document);
    return place;
  }
}
