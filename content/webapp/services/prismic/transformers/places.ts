import { Place } from '../../../types/places';
import { transformGenericFields } from '.';
import { PlacesDocument as RawPlacesDocument } from '@weco/common/prismicio-types';

export function transformPlace(doc: RawPlacesDocument): Place {
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
