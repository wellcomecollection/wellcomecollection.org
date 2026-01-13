import * as prismic from '@prismicio/client';

import { SeasonsDocument as RawSeasonsDocument } from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { isFilledLinkToDocumentWithTypedData } from '@weco/common/services/prismic/types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { Season } from '@weco/content/types/seasons';

import {
  asTitle,
  transformGenericFields,
  transformGenericFieldsFromRelationship,
} from '.';

/**
 * Transform a season from a Prismic content relationship.
 *
 * Why this exists:
 * - Relationship fields are not full `SeasonsDocument`s, even when they include
 *   some `data` from `fetchLinks`.
 * - This avoids unsafe casts and only relies on fields we can reasonably expect
 *   to exist on the relationship `data`.
 */
export function transformSeasonFromRelationship(
  field: unknown
): Season | undefined {
  const maybeField = field as
    | prismic.ContentRelationshipField<string, string, unknown>
    | undefined;

  if (!isFilledLinkToDocumentWithTypedData<RawSeasonsDocument>(maybeField)) {
    return undefined;
  }

  if (maybeField.type !== 'seasons') {
    return undefined;
  }

  if (!maybeField.uid) {
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
    type: 'seasons',
    uid: maybeField.uid,
    start: transformTimestamp(data.start),
    end: transformTimestamp(data.end),
    datePublished: undefined,
    labels: [{ text: 'Season' }],
    promo: genericFields.promo?.image ? genericFields.promo : undefined,
  };
}

/**
 * Convenience for transforming relationship groups, e.g. the output of
 * `transformSingleLevelGroup(data.seasons, 'season')`.
 */
export function transformSeasonsFromRelationshipGroup(
  fields: unknown[]
): Season[] {
  return fields.map(transformSeasonFromRelationship).filter(isNotUndefined);
}

export function transformSeason(document: RawSeasonsDocument): Season {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const promo = genericFields.promo;

  return {
    type: 'seasons',
    uid: document.uid,
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
