import { Place } from '../../../types/places';
import { transformGenericFields } from '.';
import { PlacePrismicDocument } from '../types/places';

export function transformPlace(doc: PlacePrismicDocument): Place {
  const genericFields = transformGenericFields(doc);
  return {
    ...genericFields,
    level: doc.data.level || 0,
    capacity: doc.data.capacity || undefined,
    information: doc.data.locationInformation
      ? doc.data.locationInformation
      : undefined,
  };
}
