import * as prismic from '@prismicio/client';

import { isNotUndefined } from '@weco/common/utils/type-guards';

/**
 * This is a convenience type for what the generic DataInterface type extend in @prismicio/types
 */
export type DataInterface = Record<
  string,
  prismic.AnyRegularField | prismic.GroupField | prismic.SliceZone
>;
/**
 * This allows us to get the DataInterface from prismic.PrismicDocuments when we
 * Need them for `ContentRelationshipField`s e.g.
 * type Doc = prismic.PrismicDocument<{ title: prismic.RichTextField }>
 * type DataInterface = InferDataInterface<Doc> // { title: prismic.RichTextField }
 * prismic.ContentRelationshipField<'formats', 'en-gb', DataInterface>
 */
export type InferDataInterface<T> =
  T extends prismic.PrismicDocument<infer DataInterface>
    ? DataInterface
    : never;

// This is the type we want to convert prismic
// to as it mirrors the catalogue API
export type PaginatedResults<T> = {
  currentPage: number;
  results: T[];
  pageSize: number;
  totalResults: number;
  totalPages: number;
};

// Guards
export function isFilledLinkToDocument<T = string, L = string, D = unknown>(
  field: prismic.ContentRelationshipField<T, L, D> | undefined
): field is prismic.FilledContentRelationshipField<T, L, D> {
  return isNotUndefined(field) && 'id' in field && field.isBroken === false;
}

export function isFilledLinkToDocumentWithData<
  T = string,
  L = string,
  D = unknown,
>(
  field: prismic.ContentRelationshipField<T, L, D> | undefined
): field is prismic.FilledContentRelationshipField<T, L, D> & {
  data: D extends DataInterface ? D : DataInterface;
} {
  return isFilledLinkToDocument(field) && 'data' in field;
}

export function isFilledLinkToWebField(
  field: prismic.LinkField
): field is prismic.FilledLinkToWebField {
  return (
    prismic.isFilled.link(field) && field.link_type === 'Web' && 'url' in field
  );
}

export function isFilledLinkToMediaField(
  field: prismic.LinkField
): field is prismic.FilledLinkToWebField {
  return (
    prismic.isFilled.link(field) &&
    field.link_type === 'Media' &&
    'url' in field
  );
}

export function isFilledSliceZone<
  T extends prismic.SharedSlice = prismic.SharedSlice,
>(
  sliceZone: prismic.SliceZone<T>
): sliceZone is prismic.SliceZone<T, 'filled'> {
  return prismic.isFilled.sliceZone(sliceZone);
}
