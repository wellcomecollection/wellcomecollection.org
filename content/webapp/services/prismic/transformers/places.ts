import * as prismic from '@prismicio/client';

import { PlacesDocument as RawPlacesDocument } from '@weco/common/prismicio-types';
import { isFilledLinkToDocumentWithTypedData } from '@weco/common/services/prismic/types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { Place } from '@weco/content/types/places';

import {
  asTitle,
  transformGenericFields,
  transformGenericFieldsFromRelationship,
} from '.';

/**
 * Transform a place from a Prismic content relationship.
 *
 * Why this exists:
 * - Place relationships can carry partial `data` (via `fetchLinks`/GraphQuery),
 *   but they are not full `PlacesDocument`s.
 * - This avoids pretending we have a full document (and avoids unsafe casts).
 */
export function transformPlaceFromRelationship(
  field: unknown
): Place | undefined {
  const maybeField = field as
    | prismic.ContentRelationshipField<string, string, unknown>
    | undefined;

  if (!isFilledLinkToDocumentWithTypedData<RawPlacesDocument>(maybeField)) {
    return undefined;
  }

  if (maybeField.type !== 'places') {
    return undefined;
  }

  const data = maybeField.data;
  const genericFields = transformGenericFieldsFromRelationship({
    id: maybeField.id,
    data: data as unknown as Record<string, unknown>,
  });

  const title = Array.isArray(data.title)
    ? asTitle(data.title as prismic.RichTextField)
    : genericFields.title;

  return {
    ...genericFields,
    title,
    level: data.level || 0,
    capacity: data.capacity || undefined,
    information: data.locationInformation || undefined,
  };
}

/**
 * Convenience for transforming relationship groups, e.g. the output of
 * `transformSingleLevelGroup(data.locations, 'location')`.
 */
export function transformPlacesFromRelationshipGroup(
  fields: unknown[]
): Place[] {
  return fields.map(transformPlaceFromRelationship).filter(isNotUndefined);
}

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
